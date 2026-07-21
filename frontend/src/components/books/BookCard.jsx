import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

function BookCard({ book, currentUser, onEdit, onDelete }) {
  const navigate = useNavigate();
  const isOwner = currentUser && (currentUser.id === book.seller_id || currentUser.id === book.user_id);

  return (
    <Card hoverable className="book-card-container">
      <div className="book-card-inner">
        {/* Visual Cover Header */}
        <div className="book-card-cover">
          <div className="book-card-cover__icon">📖</div>
          <div className="book-card-cover__badges">
            {book.academic_level && (
              <Badge variant="info">{book.academic_level}</Badge>
            )}
            {book.status && (
              <Badge variant={book.status === 'available' ? 'success' : 'neutral'}>
                {book.status === 'available' ? 'Disponible' : 'Vendido'}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="book-card-body">
          <div className="book-card-header">
            <h3 className="book-card-title" title={book.title}>
              {book.title}
            </h3>
            <p className="book-card-author">por {book.author}</p>
          </div>

          {book.description && (
            <p className="book-card-description">
              {book.description.length > 80
                ? `${book.description.substring(0, 80)}...`
                : book.description}
            </p>
          )}

          <div className="book-card-meta">
            <div className="book-card-price-tag">
              <span className="book-card-price-label">Precio</span>
              <span className="book-card-price-amount">
                ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="book-card-actions">
          <Button
            onClick={() => navigate(`/books/${book.id}`)}
            variant="secondary"
            size="sm"
            style={{ flex: 1 }}
          >
            Ver detalle
          </Button>

          {isOwner && (
            <div className="book-card-owner-actions">
              <Button
                onClick={() => onEdit(book)}
                variant="ghost"
                size="sm"
                title="Editar libro"
              >
                ✏️
              </Button>
              <Button
                onClick={() => onDelete(book)}
                variant="ghost"
                size="sm"
                title="Eliminar libro"
                style={{ color: 'var(--pl-danger)' }}
              >
                🗑️
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default BookCard;
