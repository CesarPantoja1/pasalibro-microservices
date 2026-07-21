import os
import requests
from flask import Blueprint, request, jsonify, g
from app.models import Book
from app import db
from app.utils import jwt_required

books_bp = Blueprint("books", __name__)
USERS_SERVICE_URL = os.environ.get("USERS_SERVICE_URL", "http://ms-users:5001/api/users")


def fetch_seller_info(seller_id):
    """Inter-service synchronous HTTP call to fetch user profile by ID from ms-users."""
    if not seller_id:
        return None
    try:
        resp = requests.get(f"{USERS_SERVICE_URL}/{seller_id}", timeout=2)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        print(f"Error communicating with ms-users for seller {seller_id}: {e}")
    return {"id": seller_id, "email": f"vendedor_{seller_id}@pasalibro.com"}


@books_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ms-books"}), 200


@books_bp.route("/", methods=["GET"])
def get_books():
    """List all available books with optional filtering."""
    query = Book.query.filter_by(status="available")

    # Filters
    level = request.args.get("level")
    if level:
        query = query.filter(Book.academic_level.ilike(f"%{level}%"))

    max_price = request.args.get("max_price", type=float)
    if max_price is not None:
        query = query.filter(Book.price <= max_price)

    q = request.args.get("q")
    if q:
        query = query.filter((Book.title.ilike(f"%{q}%")) | (Book.author.ilike(f"%{q}%")))

    books = query.order_by(Book.created_at.desc()).all()
    result = []
    for book in books:
        b_dict = book.to_dict()
        b_dict["seller"] = fetch_seller_info(book.seller_id)
        result.append(b_dict)

    return jsonify(result), 200


@books_bp.route("/<int:book_id>", methods=["GET"])
def get_book(book_id):
    """Get details of a specific book."""
    book = Book.query.get_or_404(book_id)
    b_dict = book.to_dict()
    b_dict["seller"] = fetch_seller_info(book.seller_id)
    return jsonify(b_dict), 200


@books_bp.route("/", methods=["POST"])
@jwt_required
def create_book():
    """Create a new book listing."""
    data = request.get_json()
    if not data or not data.get("title") or not data.get("author") or data.get("price") is None:
        return jsonify({"error": "Missing required fields (title, author, price)"}), 400

    new_book = Book(
        title=data["title"],
        author=data["author"],
        description=data.get("description"),
        price=data["price"],
        academic_level=data.get("academic_level"),
        condition=data.get("condition", "Usado"),
        seller_id=g.user_id
    )

    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201


@books_bp.route("/<int:book_id>", methods=["PUT"])
@jwt_required
def update_book(book_id):
    """Update book details (only by owner)."""
    book = Book.query.get_or_404(book_id)

    if book.seller_id != g.user_id:
        return jsonify({"error": "You can only edit your own books"}), 403

    data = request.get_json()
    if "title" in data:
        book.title = data["title"]
    if "author" in data:
        book.author = data["author"]
    if "description" in data:
        book.description = data["description"]
    if "price" in data:
        book.price = data["price"]
    if "academic_level" in data:
        book.academic_level = data["academic_level"]
    if "condition" in data:
        book.condition = data["condition"]

    db.session.commit()
    return jsonify(book.to_dict()), 200


@books_bp.route("/<int:book_id>", methods=["DELETE"])
@jwt_required
def delete_book(book_id):
    """Delete a book listing (only by owner)."""
    book = Book.query.get_or_404(book_id)

    if book.seller_id != g.user_id:
        return jsonify({"error": "You can only delete your own books"}), 403

    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200


@books_bp.route("/<int:book_id>/sold", methods=["PATCH"])
@jwt_required
def mark_as_sold(book_id):
    """Mark a book as sold (only by owner)."""
    book = Book.query.get_or_404(book_id)

    if book.seller_id != g.user_id:
        return jsonify({"error": "You can only update your own books"}), 403

    book.status = "sold"
    db.session.commit()
    return jsonify(book.to_dict()), 200
