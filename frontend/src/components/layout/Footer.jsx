import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer app-footer">
      <span>© {year} PasaLibro — OmniDevs</span>
      <span>Proyecto académico</span>
    </footer>
  );
}

export default Footer;
