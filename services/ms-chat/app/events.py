from flask import request, current_app
from flask_socketio import join_room, leave_room, emit
from app import socketio, db
from app.models import ChatRoom, Message
from app.utils import decode_token


@socketio.on("connect")
def handle_connect(auth=None):
    """
    Handle client connection.
    Validates JWT from the auth dict or query parameters.
    Rejects the connection if the token is invalid.
    """
    token = None

    # Strategy 1: Socket.IO auth object (recommended)
    # Client connects with: io(url, { auth: { token: "eyJ..." } })
    if auth and isinstance(auth, dict):
        token = auth.get("token")

    # Strategy 2: Query parameter fallback
    # Client connects with: io(url, { query: { token: "eyJ..." } })
    if not token:
        token = request.args.get("token")

    if not token:
        print("[SocketIO] Connection rejected: no token provided")
        return False  # Reject the connection

    try:
        payload = decode_token(token, current_app.config['SECRET_KEY'])
        # Store user_id in the SocketIO session for later events
        request.environ['user_id'] = payload.get('user_id')
        print(f"[SocketIO] Client connected: user_id={payload.get('user_id')}")
    except Exception:
        print("[SocketIO] Connection rejected: invalid token")
        return False  # Reject the connection


@socketio.on("disconnect")
def handle_disconnect():
    """Handle client disconnection."""
    user_id = request.environ.get('user_id', 'unknown')
    print(f"[SocketIO] Client disconnected: user_id={user_id}")


@socketio.on("join_room")
def handle_join_room(data):
    """
    Join a chat room.
    Verifies the user is a participant (buyer or seller) before joining.
    Expects: { "room_id": <int> }
    """
    user_id = request.environ.get('user_id')
    if not user_id:
        emit("error", {"error": "Authentication required"})
        return

    room_id = data.get("room_id") if isinstance(data, dict) else None
    if room_id is None:
        emit("error", {"error": "room_id is required"})
        return

    room = db.session.get(ChatRoom, room_id)
    if not room:
        emit("error", {"error": "Room not found"})
        return

    # IDOR prevention: only participants can join
    if room.buyer_id != user_id and room.seller_id != user_id:
        emit("error", {"error": "You are not a participant of this room"})
        return

    join_room(room_id)
    emit("room_joined", {
        "room_id": room_id,
        "message": f"User {user_id} joined room {room_id}"
    }, room=room_id)


@socketio.on("send_message")
def handle_send_message(data):
    """
    Send a message to a chat room.
    Persists the message to the database and broadcasts it to the room.
    Expects: { "room_id": <int>, "content": <str> }
    """
    user_id = request.environ.get('user_id')
    if not user_id:
        emit("error", {"error": "Authentication required"})
        return

    if not isinstance(data, dict):
        emit("error", {"error": "Invalid message format"})
        return

    room_id = data.get("room_id")
    content = data.get("content")

    if room_id is None or not content:
        emit("error", {"error": "room_id and content are required"})
        return

    # Validate content is a non-empty string
    if not isinstance(content, str) or not content.strip():
        emit("error", {"error": "content must be a non-empty string"})
        return

    room = db.session.get(ChatRoom, room_id)
    if not room:
        emit("error", {"error": "Room not found"})
        return

    # IDOR prevention: only participants can send messages
    if room.buyer_id != user_id and room.seller_id != user_id:
        emit("error", {"error": "You are not a participant of this room"})
        return

    # Persist the message
    new_message = Message(
        room_id=room_id,
        sender_id=user_id,
        content=content.strip()
    )
    db.session.add(new_message)
    db.session.commit()

    # Broadcast to all clients in the room
    emit("new_message", new_message.to_dict(), room=room_id)


@socketio.on("leave_room")
def handle_leave_room(data):
    """
    Leave a chat room.
    Expects: { "room_id": <int> }
    """
    user_id = request.environ.get('user_id')
    if not user_id:
        emit("error", {"error": "Authentication required"})
        return

    room_id = data.get("room_id") if isinstance(data, dict) else None
    if room_id is None:
        emit("error", {"error": "room_id is required"})
        return

    leave_room(room_id)
    emit("room_left", {
        "room_id": room_id,
        "message": f"User {user_id} left room {room_id}"
    }, room=room_id)
