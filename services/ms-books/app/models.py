from datetime import datetime
from app import db


class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    academic_level = db.Column(db.String(100), nullable=True)
    condition = db.Column(db.String(50), nullable=False, default='Usado')
    status = db.Column(db.String(50), nullable=False, default='available')  # available, sold
    seller_id = db.Column(db.Integer, nullable=False)  # References users.id in ms-users
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'price': self.price,
            'academic_level': self.academic_level,
            'condition': self.condition,
            'status': self.status,
            'seller_id': self.seller_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
