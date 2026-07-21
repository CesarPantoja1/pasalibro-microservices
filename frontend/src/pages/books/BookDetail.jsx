import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, deleteBook } from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBookById(id);
        setBook(response.data);
      } catch (err) {
        console.error('Error fetching book detail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBook(id);
      setDeleteModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting book:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <Loader text="Cargando información del libro..." />
      </div>
    );
  }

  if (error || !book) {
    return (
      <EmptyState
        icon="🔍"
        title="Libro no encontrado"
        description="El libro que estás buscando no existe o fue retirado del catálogo."
        actionLabel="Volver al catálogo"
        onAction={() => navigate('/dashboard')}
      />
    );
  }

  const isOwner = user && (user.id === book.seller_id || user.id === book.user_id);

  return (
    <div className="book-detail-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Catálogo / Detalle</p>
          <h1 className="page-header__title">{book.title}</h1>
          <p className="page-header__subtitle">Publicado por {book.author}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Volver al catálogo
        </Button>
      </div>

      {/* Main Grid */}
      <div className="book-detail-grid">
        {/* Left Column: Visual Cover Card */}
        <Card className="book-detail-cover-card">
          <div className="book-detail-cover">
            <div className="book-detail-cover__icon">📖</div>
            {book.status && (
              <div className="book-detail-cover__badge">
                <Badge variant={book.status === 'available' ? 'success' : 'neutral'}>
                  {book.status === 'available' ? 'Disponible' : 'Vendido'}
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Right Column: Detailed Info & Actions */}
        <Card className="book-detail-info-card">
          <div className="ui-card__body form-stack">
            {/* Price Header */}
            <div className="book-detail-price-box">
              <span className="book-detail-price-label">Precio de venta</span>
              <span className="book-detail-price-value">
                ${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}
              </span>
            </div>

            {/* Description Section */}
            <div className="book-detail-section">
              <h3 className="book-detail-section-title">Descripción</h3>
              <p className="book-detail-description">
                {book.description || 'El vendedor no incluyó una descripción adicional.'}
              </p>
            </div>

            {/* Metadata Rows */}
            <div className="book-detail-meta-list">
              <div className="profile-meta-row">
                <span className="profile-meta-row__label">Autor</span>
                <span className="profile-meta-row__value">{book.author}</span>
              </div>
              {book.academic_level && (
                <div className="profile-meta-row">
                  <span className="profile-meta-row__label">Nivel académico</span>
                  <span className="profile-meta-row__value">{book.academic_level}</span>
                </div>
              )}
              <div className="profile-meta-row">
                <span className="profile-meta-row__label">Vendedor</span>
                <span className="profile-meta-row__value">
                  {book.seller?.email || `Usuario #${book.seller_id}`}
                </span>
              </div>
              {book.created_at && (
                <div className="profile-meta-row">
                  <span className="profile-meta-row__label">Fecha de publicación</span>
                  <span className="profile-meta-row__value">
                    {new Date(book.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="form-actions" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--pl-line)' }}>
              {isOwner ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/books/edit/${book.id}`)}
                  >
                    ✏️ Editar publicación
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    🗑️ Eliminar libro
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    const email = book.seller?.email;
                    if (email) {
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Consulta sobre libro: ${book.title}`)}`;
                    } else {
                      alert(`Contactando al vendedor #${book.seller_id}...`);
                    }
                  }}
                >
                  💬 Contactar a {book.seller?.email || `Vendedor #${book.seller_id}`}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar publicación"
      >
        <p className="text-sm text-muted" style={{ marginBottom: '1.25rem' }}>
          ¿Estás seguro de eliminar el libro <strong className="text-ink">"{book.title}"</strong>? Esta acción no se puede deshacer.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={() => setDeleteModalOpen(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default BookDetail;
