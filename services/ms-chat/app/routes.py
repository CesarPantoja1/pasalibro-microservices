from flask import Blueprint, request, jsonify, g
from app.models import ChatRoom, Message
from app import db
from app.utils import jwt_required

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ms-chat"}), 200


@chat_bp.route("/rooms", methods=["POST"])
@jwt_required
def create_room():
    """
    Create or retrieve a chat room.
    Idempotent: returns the existing room if the buyer-seller-book
    combination already exists.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    seller_id = data.get("seller_id")
    book_id = data.get("book_id")

    if seller_id is None or book_id is None:
        return jsonify({"error": "Missing required fields (seller_id, book_id)"}), 400

    # Validate types
    if not isinstance(seller_id, int) or not isinstance(book_id, int):
        return jsonify({"error": "seller_id and book_id must be integers"}), 400

    buyer_id = g.user_id

    # Prevent chatting with yourself
    if buyer_id == seller_id:
        return jsonify({"error": "You cannot create a chat with yourself"}), 400

    # Idempotent: check if room already exists
    existing_room = ChatRoom.query.filter_by(
        buyer_id=buyer_id,
        seller_id=seller_id,
        book_id=book_id
    ).first()

    if existing_room:
        return jsonify(existing_room.to_dict()), 200

    new_room = ChatRoom(
        buyer_id=buyer_id,
        seller_id=seller_id,
        book_id=book_id
    )
    db.session.add(new_room)
    db.session.commit()

    return jsonify(new_room.to_dict()), 201


@chat_bp.route("/rooms", methods=["GET"])
@jwt_required
def get_rooms():
    """
    List all chat rooms where the authenticated user participates
    (either as buyer or seller).
    """
    user_id = g.user_id

    rooms = ChatRoom.query.filter(
        (ChatRoom.buyer_id == user_id) | (ChatRoom.seller_id == user_id)
    ).order_by(ChatRoom.created_at.desc()).all()

    return jsonify([room.to_dict() for room in rooms]), 200


@chat_bp.route("/rooms/<int:room_id>/messages", methods=["GET"])
@jwt_required
def get_messages(room_id):
    """
    Retrieve message history for a specific room.
    Only participants (buyer or seller) can access the messages.
    """
    user_id = g.user_id

    room = ChatRoom.query.get_or_404(room_id)

    # IDOR prevention: only participants can read messages
    if room.buyer_id != user_id and room.seller_id != user_id:
        return jsonify({"error": "You are not a participant of this room"}), 403

    messages = Message.query.filter_by(room_id=room_id).order_by(
        Message.created_at.asc()
    ).all()

    return jsonify([message.to_dict() for message in messages]), 200
