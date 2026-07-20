import pytest
import jwt
from datetime import datetime, timedelta
from app import create_app, db


@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SECRET_KEY": "test-secret",
        "DB_SCHEMA": None  # SQLite doesn't use schemas like postgres
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_headers(app):
    token = jwt.encode({
        "user_id": 1,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }, app.config["SECRET_KEY"], algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def user2_headers(app):
    token = jwt.encode({
        "user_id": 2,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }, app.config["SECRET_KEY"], algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


def test_health(client):
    response = client.get("/api/books/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


def test_create_book(client, auth_headers):
    data = {
        "title": "Calculo Avanzado",
        "author": "James Stewart",
        "price": 45.5,
        "academic_level": "Universidad"
    }
    response = client.post("/api/books/", json=data, headers=auth_headers)
    assert response.status_code == 201
    assert response.json["title"] == "Calculo Avanzado"
    assert response.json["seller_id"] == 1
    assert response.json["status"] == "available"


def test_create_book_no_auth(client):
    response = client.post("/api/books/", json={"title": "Test", "author": "Test", "price": 10})
    assert response.status_code == 401


def test_get_books(client, auth_headers):
    data1 = {"title": "Libro 1", "author": "Autor A", "price": 10, "academic_level": "Basico"}
    client.post("/api/books/", json=data1, headers=auth_headers)

    data2 = {"title": "Libro 2", "author": "Autor B", "price": 20, "academic_level": "Avanzado"}
    client.post("/api/books/", json=data2, headers=auth_headers)

    # Test get all
    resp = client.get("/api/books/")
    assert resp.status_code == 200
    assert len(resp.json) == 2

    # Test filtering by price
    resp = client.get("/api/books/?max_price=15")
    assert len(resp.json) == 1
    assert resp.json[0]["title"] == "Libro 1"

    # Test filtering by search query
    resp = client.get("/api/books/?q=Autor A")
    assert len(resp.json) == 1


def test_update_book(client, auth_headers, user2_headers):
    resp = client.post("/api/books/", json={"title": "Libro", "author": "Autor", "price": 10}, headers=auth_headers)
    book_id = resp.json["id"]

    # Update with owner (Success)
    resp = client.put(f"/api/books/{book_id}", json={"price": 15}, headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json["price"] == 15

    # Update with different user (Forbidden)
    resp = client.put(f"/api/books/{book_id}", json={"price": 20}, headers=user2_headers)
    assert resp.status_code == 403


def test_mark_as_sold(client, auth_headers):
    resp = client.post("/api/books/", json={"title": "Libro", "author": "Autor", "price": 10}, headers=auth_headers)
    book_id = resp.json["id"]

    resp = client.patch(f"/api/books/{book_id}/sold", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json["status"] == "sold"

    # Should not appear in get_books list since it's sold
    resp = client.get("/api/books/")
    assert len(resp.json) == 0


def test_delete_book(client, auth_headers, user2_headers):
    resp = client.post("/api/books/", json={"title": "Libro", "author": "Autor", "price": 10}, headers=auth_headers)
    book_id = resp.json["id"]

    # Delete with different user (Forbidden)
    resp = client.delete(f"/api/books/{book_id}", headers=user2_headers)
    assert resp.status_code == 403

    # Delete with owner (Success)
    resp = client.delete(f"/api/books/{book_id}", headers=auth_headers)
    assert resp.status_code == 200

    resp = client.get(f"/api/books/{book_id}")
    assert resp.status_code == 404
