from flask import Blueprint, jsonify

books_bp = Blueprint("books", __name__)


@books_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ms-books"}), 200
