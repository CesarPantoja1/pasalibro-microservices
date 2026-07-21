import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/AuthLayout';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      
      const token = response.data.access_token || response.data.token;
      
      if (token) {
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        setError('No se recibió token de autenticación.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error al iniciar sesión. Por favor, verifica tus credenciales.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
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
            autoComplete="current-password"
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn auth-btn--primary"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
        
        <div className="auth-links">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <Link to="/register">Crear una cuenta nueva</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
