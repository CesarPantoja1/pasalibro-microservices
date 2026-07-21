import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar app-navbar" aria-label="Navegación principal">
      <a className="app-brand" href="/profile">
        <span className="app-brand-mark">📘</span>
        <span>PasaLibro</span>
      </a>

      <div className="app-nav-links" role="navigation" aria-label="Secciones principales">
        <NavLink to="/profile" className="nav-link">
          Perfil
        </NavLink>
        <NavLink to="/books/1" className="nav-link">
          Libros
        </NavLink>
      </div>

      <div className="app-nav-user">
        <span className="nav-link app-user-chip">Usuario autenticado</span>
        <button type="button" className="navbar__logout-btn">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
