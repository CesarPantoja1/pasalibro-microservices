import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Catálogo</p>
          <h1 className="page-header__title">Detalle del libro</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Volver
        </Button>
      </div>

      <p className="text-sm text-muted">
        Vista de detalle del libro <strong>#{id}</strong> — pendiente de implementación por el equipo.
      </p>
    </div>
  );
}

export default BookDetail;
