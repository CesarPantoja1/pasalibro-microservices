from functools import wraps
from flask import request, jsonify, g, current_app
import jwt


def jwt_required(f):
    """
    Decorator to protect routes with JWT.
    Extracts token from 'Authorization: Bearer <token>' header.
    Validates token and injects user_id into flask.g.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({
                "error": "Invalid Authorization header format. "
                         "Expected 'Bearer <token>'"
            }), 401

        token = parts[1]

        try:
            # Decode the token using the shared SECRET_KEY
            payload = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
            g.user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated_function
