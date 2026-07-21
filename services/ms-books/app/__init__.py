import json
import logging
import socket
from datetime import datetime

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from prometheus_flask_exporter import PrometheusMetrics

from app.config import Config

db = SQLAlchemy()
migrate = Migrate()


class LogstashSocketHandler(logging.Handler):
    def __init__(self, host, port, service_name):
        super().__init__()
        self.host = host
        self.port = port
        self.service_name = service_name

    def emit(self, record):
        # Formato exacto requerido por el equipo para Logstash
        log_entry = {
            "service": self.service_name,
            "level": record.levelname,
            "message": self.format(record),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2.0)
            sock.connect((self.host, self.port))
            sock.sendall((json.dumps(log_entry) + "\n").encode('utf-8'))
            sock.close()
        except Exception as e:
            # Fallback silencioso a consola si Logstash está caído
            print(f"Logstash unreachable: {e} - {log_entry['message']}")


def setup_logging(service_name):
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Limpiar handlers previos para evitar duplicados
    if logger.hasHandlers():
        logger.handlers.clear()

    # Handler para enviar a Logstash por TCP
    logstash_handler = LogstashSocketHandler("logstash", 5044, service_name)
    logger.addHandler(logstash_handler)

    # Opcional: Mantener handler de consola para desarrollo local
    console_handler = logging.StreamHandler()
    logger.addHandler(console_handler)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Observability
    setup_logging('ms-books')
    PrometheusMetrics(app)

    # Register blueprints
    from app.routes import books_bp
    app.register_blueprint(books_bp, url_prefix="/api/books")

    return app
