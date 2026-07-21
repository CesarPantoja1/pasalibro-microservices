import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Catálogo',    icon: '🏠' },
  { to: '/profile',   label: 'Mi Perfil',   icon: '👤' },
  { to: '/books/new', label: 'Publicar',    icon: '➕' },
  { to: '/chat',      label: 'Chat',        icon: '💬' },
];

function Sidebar() {
  return (
    <aside className="sidebar app-sidebar" aria-label="Navegación lateral">
      <nav className="sidebar__nav app-sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="sidebar__link app-sidebar-link"
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
