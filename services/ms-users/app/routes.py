from flask import Blueprint, jsonify

users_bp = Blueprint("users", __name__)


@users_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ms-users"}), 200
