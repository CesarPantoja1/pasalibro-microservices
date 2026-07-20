from app import socketio


@socketio.on("connect")
def handle_connect():
    """Handle client connection."""
    print("[SocketIO] Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    """Handle client disconnection."""
    print("[SocketIO] Client disconnected")
