import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar app-navbar" aria-label="Navegación principal">
      <a className="app-brand" href="/dashboard">
        <span className="app-brand-icon">📘</span>
        <span>PasaLibro</span>
      </a>

      <div className="app-nav-links" role="navigation" aria-label="Secciones principales">
        <NavLink to="/dashboard" className="nav-link">
          Catálogo
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Mi Perfil
        </NavLink>
      </div>

      <div className="app-nav-user">
        <button type="button" className="navbar__logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
