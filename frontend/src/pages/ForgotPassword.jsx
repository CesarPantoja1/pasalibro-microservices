import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/users/forgot-password', { email });
      // Siempre mostramos el mismo mensaje para no revelar si el correo existe o no
      setMessage('Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.');
      setEmail('');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Error al procesar la solicitud. Por favor, intenta de nuevo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Recuperar Contraseña</h2>
        
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
        
        <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555' }}>
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

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
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-btn auth-btn--primary"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Instrucciones'}
        </button>
        
        <div className="auth-links">
          <Link to="/login">Volver al login</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
