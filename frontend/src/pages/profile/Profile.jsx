import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/userService';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Loader from '../../components/ui/Loader.jsx';

function Profile() {
  const { user: authUser, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    role: '',
    created_at: '',
    newPassword: '',
  });

  // Carga inicial (se ejecuta una sola vez al montar)
  useEffect(() => {
    let isMounted = true;

    getProfile()
      .then((response) => {
        if (!isMounted) return;
        const userData = response.data;
        setFormData({
          email: userData.email || '',
          role: userData.role || 'user',
          created_at: userData.created_at || '',
          newPassword: '',
        });
        setUser(userData);
      })
      .catch((err) => {
        console.error('Error cargando perfil:', err);
        if (isMounted && authUser) {
          setFormData({
            email: authUser.email || '',
            role: authUser.role || 'user',
            created_at: authUser.created_at || '',
            newPassword: '',
          });
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = useMemo(() => {
    const email = formData.email || '';
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }, [formData.email]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      setSaving(true);
      const payload = { email: formData.email };
      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const response = await updateProfile(payload);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      setMessage('¡Perfil actualizado con éxito!');
      setEditing(false);
      setFormData((prev) => ({ ...prev, newPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (authUser) {
      setFormData({
        email: authUser.email || '',
        role: authUser.role || 'user',
        created_at: authUser.created_at || '',
        newPassword: '',
      });
    }
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
        <Loader text="Cargando perfil de usuario..." />
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <p className="page-header__eyebrow">Cuenta</p>
          <h1 className="page-header__title">Mi perfil</h1>
          <p className="page-header__subtitle">
            Consulta y actualiza tu información de cuenta
          </p>
        </div>
        {!editing ? (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            ✏️ Editar perfil
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleCancel}>
            ✕ Cancelar edición
          </Button>
        )}
      </div>

      {/* Alerts */}
      {message && (
        <div className="alert alert--success" style={{ marginBottom: '1.25rem' }}>
          {message}
        </div>
      )}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="profile-grid">
        {/* Info card */}
        <Card>
          <div className="ui-card__body">
            <div className="profile-info">
              <div className="profile-avatar">{initials}</div>
              <div>
                <p className="profile-info__name">{formData.email}</p>
                <p className="profile-info__email">ID de cuenta: #{authUser?.id || 'N/A'}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Badge variant="success">Activo</Badge>
                  <Badge variant="info">{formData.role === 'admin' ? 'Administrador' : 'Estudiante'}</Badge>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--pl-line)' }}>
              <div className="profile-meta-row">
                <span className="profile-meta-row__label">Miembro desde</span>
                <span className="profile-meta-row__value">
                  {formData.created_at
                    ? new Date(formData.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit form card */}
        <Card>
          <div className="ui-card__header">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--pl-ink)', margin: 0 }}>
                Información de la cuenta
              </h3>
              <p className="text-sm text-muted" style={{ marginTop: '2px' }}>
                {editing ? 'Modifica tu correo o contraseña y guarda las actualizaciones.' : 'Modo consulta. Presiona "Editar perfil" para hacer cambios.'}
              </p>
            </div>
          </div>

          <div className="ui-card__body">
            <form onSubmit={handleSave} className="form-stack">
              <Input
                label="Correo Electrónico *"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                disabled={!editing}
              />

              <Input
                label="Rol del Sistema"
                name="role"
                value={formData.role === 'admin' ? 'Administrador' : 'Estudiante'}
                disabled
              />

              {editing && (
                <Input
                  label="Nueva Contraseña (opcional)"
                  name="newPassword"
                  type="password"
                  placeholder="Déjalo en blanco si no deseas cambiarla"
                  value={formData.newPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                />
              )}

              {editing && (
                <div className="form-actions">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleCancel} disabled={saving}>
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
