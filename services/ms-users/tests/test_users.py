import pytest
from app import create_app, db


@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SECRET_KEY": "test-secret",
        "DB_SCHEMA": None
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_health(client):
    response = client.get("/api/users/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


def test_register_success(client):
    data = {"email": "test@example.com", "password": "password123"}
    response = client.post("/api/users/register", json=data)

    assert response.status_code == 201
    assert "user" in response.json
    assert response.json["user"]["email"] == "test@example.com"


def test_register_duplicate(client):
    data = {"email": "test@example.com", "password": "password123"}
    client.post("/api/users/register", json=data)

    response = client.post("/api/users/register", json=data)
    assert response.status_code == 409
    assert "error" in response.json


def test_login_success(client):
    data = {"email": "test@example.com", "password": "password123"}
    client.post("/api/users/register", json=data)

    response = client.post("/api/users/login", json=data)
    assert response.status_code == 200
    assert "token" in response.json
    assert response.json["user"]["email"] == "test@example.com"


def test_login_invalid_credentials(client):
    data = {"email": "test@example.com", "password": "password123"}
    client.post("/api/users/register", json=data)

    response = client.post("/api/users/login", json={"email": "test@example.com", "password": "wrong"})
    assert response.status_code == 401
    assert "error" in response.json


def test_profile_success(client):
    # Register and Login
    data = {"email": "test@example.com", "password": "password123"}
    client.post("/api/users/register", json=data)
    login_resp = client.post("/api/users/login", json=data)
    token = login_resp.json["token"]

    # Get Profile
    response = client.get("/api/users/profile", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json["email"] == "test@example.com"


def test_profile_unauthorized(client):
    response = client.get("/api/users/profile")
    assert response.status_code == 401
