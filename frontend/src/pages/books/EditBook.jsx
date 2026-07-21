import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../../services/bookService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';

function EditBook() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await getBookById(id);
      const book = response.data;
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price || '',
      });
    } catch {
      setError('No se pudo cargar la información del libro.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.author || !formData.price) {
      setError('Completa los campos obligatorios: Título, Autor y Precio.');
      return;
    }

    try {
      setSaving(true);
      await updateBook(id, {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        price: parseFloat(formData.price),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Hubo un error al actualizar el libro.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
        <Loader text="Cargando libro..." />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Catálogo</p>
          <h1 className="page-header__title">Editar libro</h1>
          <p className="page-header__subtitle">
            Actualiza la información del libro
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Volver
        </Button>
      </div>

      {/* Form */}
      <Card style={{ maxWidth: '600px' }}>
        <div className="ui-card__body">
          {error && (
            <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-stack">
            <Input
              label="Título del libro *"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <Input
              label="Autor *"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />

            <div className="ui-field">
              <span className="ui-field__label">Descripción</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="ui-textarea"
              />
            </div>

            <Input
              label="Precio ($) *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />

            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default EditBook;
