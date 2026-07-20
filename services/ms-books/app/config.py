import os


class Config:
    """Base configuration for ms-books."""

    SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-key")

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://localhost:5432/pasalibro"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Schema isolation
    DB_SCHEMA = os.environ.get("DB_SCHEMA", "schema_books")
