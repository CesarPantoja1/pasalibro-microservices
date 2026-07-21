import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../../services/bookService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ACADEMIC_LEVELS = [
  'A1 - Principiante',
  'A2 - Básico',
  'B1 - Intermedio',
  'B2 - Intermedio Alto',
  'C1 - Avanzado',
  'C2 - Maestría',
  'Universidad / Académico',
];

function CreateBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    academic_level: 'B1 - Intermedio',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setLoading(true);
      await createBook({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        price: parseFloat(formData.price),
        academic_level: formData.academic_level,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Hubo un error al publicar el libro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Catálogo</p>
          <h1 className="page-header__title">Publicar un libro de Inglés</h1>
          <p className="page-header__subtitle">
            Comparte un libro con la comunidad de PasaLibro
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
              placeholder="Ej. English File Intermediate"
              value={formData.title}
              onChange={handleChange}
            />

            <Input
              label="Autor *"
              name="author"
              placeholder="Ej. Christina Latham-Koenig"
              value={formData.author}
              onChange={handleChange}
            />

            <div className="ui-field">
              <span className="ui-field__label">Nivel Académico (Inglés)</span>
              <select
                name="academic_level"
                value={formData.academic_level}
                onChange={handleChange}
                className="ui-input"
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="ui-field">
              <span className="ui-field__label">Descripción</span>
              <textarea
                name="description"
                placeholder="Estado del libro, edición, notas sobre ejercicios..."
                value={formData.description}
                onChange={handleChange}
                className="ui-textarea"
              />
            </div>

            <Input
              label="Precio ($) *"
              name="price"
              type="number"
              placeholder="Ej. 15.00"
              value={formData.price}
              onChange={handleChange}
            />

            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Publicando...' : 'Publicar libro'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
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

export default CreateBook;
