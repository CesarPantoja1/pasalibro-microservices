import React from 'react';
import '../styles/auth.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-logo">
        <h1>PasaLibro</h1>
      </div>
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
