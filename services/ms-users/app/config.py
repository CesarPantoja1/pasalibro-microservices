import os


class Config:
    """Base configuration for ms-users."""

    SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES", 3600))

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql://localhost:5432/pasalibro"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Schema isolation
    DB_SCHEMA = os.environ.get("DB_SCHEMA", "schema_users")
