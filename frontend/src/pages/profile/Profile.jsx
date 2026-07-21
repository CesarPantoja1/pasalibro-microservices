import React, { useMemo, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';

const FIELDS = [
  { label: 'Nombre',  key: 'name' },
  { label: 'Correo',  key: 'email' },
  { label: 'Rol',     key: 'role' },
];

/* Dato mock hasta que el backend lo provea */
const mockData = {
  name: 'Ana Torres',
  email: 'ana.torres@uni.edu',
  role: 'Estudiante',
  status: 'Activo',
  registeredAt: '15 ago. 2024',
  bio: 'Estudiante de inglés interesada en intercambiar libros de lectura y preparación académica.',
};

function Profile() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(mockData);

  const initials = useMemo(() => {
    const n = formData.name || '';
    return n
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }, [formData.name]);

  const handleChange = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCancel = () => {
    setFormData(mockData);
    setEditing(false);
  };

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Cuenta</p>
          <h1 className="page-header__title">Mi perfil</h1>
          <p className="page-header__subtitle">
            Consulta y actualiza tu información personal
          </p>
        </div>
        {!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Editar perfil
          </Button>
        )}
      </div>

      {/* Grid */}
      <div className="profile-grid">
        {/* Info card */}
        <Card>
          <div className="ui-card__body">
            <div className="profile-info">
              <div className="profile-avatar">{initials}</div>
              <div>
                <p className="profile-info__name">{formData.name}</p>
                <p className="profile-info__email">{formData.email}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Badge variant="success">{formData.status}</Badge>
                  <Badge variant="info">{formData.role}</Badge>
                </div>
              </div>
            </div>

            <p className="profile-bio">{formData.bio}</p>

            <div style={{ marginTop: '1rem' }}>
              <div className="profile-meta-row">
                <span className="profile-meta-row__label">Registro</span>
                <span className="profile-meta-row__value">{formData.registeredAt}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit form card */}
        <Card>
          <div className="ui-card__header">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pl-ink)', margin: 0 }}>
                Información personal
              </h3>
              <p className="text-sm text-muted" style={{ marginTop: '2px' }}>
                {editing ? 'Edita tus datos y guarda los cambios.' : 'Activa la edición para modificar tus datos.'}
              </p>
            </div>
          </div>

          <div className="ui-card__body">
            <div className="form-stack">
              {FIELDS.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  value={formData[field.key]}
                  onChange={handleChange(field.key)}
                  disabled={!editing}
                />
              ))}

              <div className="form-actions">
                {editing ? (
                  <>
                    <Button variant="primary" onClick={() => setEditing(false)}>
                      Guardar cambios
                    </Button>
                    <Button variant="ghost" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={() => setEditing(true)}>
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
