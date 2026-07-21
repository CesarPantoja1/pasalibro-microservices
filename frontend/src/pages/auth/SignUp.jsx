import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/AuthLayout';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    setLoading(true);

    try {
      await api.post('/users/register', { email, password });
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error al registrar la cuenta. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-success" style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>
            Registro exitoso, redirigiendo...
          </div>
        )}
        
        <div className="auth-input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading || success}
          />
        </div>
        
        <div className="auth-input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading || success}
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            disabled={loading || success}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn auth-btn--primary"
          disabled={loading || success}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        
        <div className="auth-links">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
