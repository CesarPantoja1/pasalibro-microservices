from functools import wraps
from flask import request, jsonify, g, current_app
import jwt


def jwt_required(f):
    """
    Decorator to protect routes with JWT.
    Expects 'Authorization: Bearer <token>' header.
    Validates the token using the app's SECRET_KEY and injects g.user_id.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token is missing or invalid'}), 401

        token = auth_header.split(' ')[1]
        try:
            # We assume the JWT payload contains 'user_id'
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            g.user_id = payload.get('user_id')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated
