import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, deleteBook } from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const q = searchTerm.toLowerCase();
    return (
      book.title?.toLowerCase().includes(q) ||
      book.author?.toLowerCase().includes(q)
    );
  });

  const confirmDelete = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;
    try {
      setDeleting(true);
      await deleteBook(bookToDelete.id);
      setDeleteModalOpen(false);
      setBookToDelete(null);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Catálogo</p>
          <h1 className="page-header__title">Libros disponibles</h1>
          <p className="page-header__subtitle">
            Explora los libros publicados por la comunidad
          </p>
        </div>
        <Button onClick={() => navigate('/books/new')} variant="primary">
          + Publicar libro
        </Button>
      </div>

      {/* Search bar */}
      <div style={{ maxWidth: '360px', marginBottom: '1.5rem' }}>
        <Input
          placeholder="Buscar por título o autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <Loader text="Cargando catálogo..." />
        </div>
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          icon="📚"
          title={searchTerm ? 'Sin resultados' : 'Catálogo vacío'}
          description={
            searchTerm
              ? `No se encontraron libros para "${searchTerm}".`
              : 'Sé el primero en publicar un libro para la comunidad.'
          }
          actionLabel={searchTerm ? undefined : 'Publicar libro'}
          onAction={searchTerm ? undefined : () => navigate('/books/new')}
        />
      ) : (
        <div className="grid-books">
          {filteredBooks.map((book) => (
            <Card key={book.id} hoverable>
              {/* Cover placeholder */}
              <div className="book-card__cover">📖</div>

              <div className="ui-card__body" style={{ paddingTop: '0.75rem' }}>
                <div className="book-card">
                  <p className="book-card__title">{book.title}</p>
                  <p className="book-card__author">{book.author}</p>
                  <p className="book-card__price">${book.price}</p>

                  <div className="book-card__footer">
                    <Button
                      onClick={() => navigate(`/books/${book.id}`)}
                      variant="secondary"
                      size="sm"
                      style={{ flex: 1 }}
                    >
                      Ver detalle
                    </Button>

                    {user && user.id === book.user_id && (
                      <>
                        <Button
                          onClick={() => navigate(`/books/edit/${book.id}`)}
                          variant="ghost"
                          size="sm"
                        >
                          ✏️
                        </Button>
                        <Button
                          onClick={() => confirmDelete(book)}
                          variant="ghost"
                          size="sm"
                        >
                          🗑️
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Eliminar libro"
      >
        <p className="text-sm text-muted" style={{ marginBottom: '1.25rem' }}>
          ¿Estás seguro de que deseas eliminar{' '}
          <strong className="text-ink">"{bookToDelete?.title}"</strong>?{' '}
          Esta acción no se puede deshacer.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="secondary"
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="danger" disabled={deleting}>
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;
