import React, { useMemo, useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';

const mockUser = {
  name: 'Ana Torres',
  email: 'ana.torres@uni.edu',
  role: 'Estudiante',
  status: 'Activo',
  registeredAt: '2024-08-15',
  bio: 'Estudiante de inglés interesada en intercambiar libros de lectura y preparación académica.',
};

function Profile() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(mockUser);

  const profileFields = useMemo(
    () => [
      { label: 'Nombre', key: 'name' },
      { label: 'Correo', key: 'email' },
      { label: 'Rol', key: 'role' },
      { label: 'Estado', key: 'status' },
    ],
    [],
  );

  const handleChange = (key) => (event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleCancel = () => {
    setFormData(mockUser);
    setEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div>
          <span className="profile-page__eyebrow">Perfil</span>
          <h1>Mi cuenta</h1>
          <p>Consulta y actualiza tu información personal desde esta vista.</p>
        </div>

        {!editing ? (
          <Button variant="primary" onClick={() => setEditing(true)}>
            Editar perfil
          </Button>
        ) : null}
      </div>

      <div className="profile-page__grid">
        <Card className="profile-card">
          <div className="profile-card__avatar">AT</div>
          <div className="profile-card__body">
            <h2>{formData.name}</h2>
            <p>{formData.email}</p>
            <div className="profile-card__badges">
              <Badge variant="success">{formData.status}</Badge>
              <Badge variant="info">{formData.role}</Badge>
            </div>
            <p className="profile-card__bio">{formData.bio}</p>
            <div className="profile-card__meta">
              <span>Fecha de registro</span>
              <strong>{formData.registeredAt}</strong>
            </div>
          </div>
        </Card>

        <Card className="profile-form-card">
          <div className="profile-form-card__header">
            <h3>Información personal</h3>
            <p>Modifica tus datos básicos para la cuenta.</p>
          </div>

          <div className="profile-form-card__fields">
            {profileFields.map((field) => (
              <Input
                key={field.key}
                label={field.label}
                value={formData[field.key]}
                onChange={handleChange(field.key)}
                disabled={!editing}
              />
            ))}
          </div>

          <div className="profile-form-card__actions">
            {editing ? (
              <>
                <Button variant="primary" onClick={() => setEditing(false)}>
                  Guardar
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
        </Card>
      </div>
    </div>
  );
}

export default Profile;
