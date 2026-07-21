import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar app-sidebar" aria-label="Navegación lateral">
      <nav className="sidebar__nav app-sidebar-nav">
        <NavLink to="/profile" className="sidebar__link app-sidebar-link">
          Perfil
        </NavLink>
        <NavLink to="/books/1" className="sidebar__link app-sidebar-link">
          Libros
        </NavLink>
        <NavLink to="/login" className="sidebar__link app-sidebar-link">
          Login
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
