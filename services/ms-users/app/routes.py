from flask import Blueprint, jsonify, request, current_app, g
from datetime import datetime, timedelta
import jwt
from app.models import User
from app.utils import jwt_required
from app import db

users_bp = Blueprint("users", __name__)


@users_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "ms-users"}), 200


@users_bp.route("/register", methods=["POST"])
def register():
    """Registers a new user."""
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User with this email already exists"}), 409

    new_user = User(email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201


@users_bp.route("/login", methods=["POST"])
def login():
    """Authenticates a user and returns a JWT."""
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate JWT
    expires_in = current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES", 3600)
    expiration = datetime.utcnow() + timedelta(seconds=int(expires_in))

    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": expiration
    }

    token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }), 200


@users_bp.route("/profile", methods=["GET"])
@jwt_required
def profile():
    """Returns the profile of the authenticated user."""
    user = User.query.get(g.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200
