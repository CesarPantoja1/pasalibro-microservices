from flask import Blueprint, jsonify

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ms-chat"}), 200
