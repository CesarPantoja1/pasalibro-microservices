import React from 'react';

function Badge({ children, variant = 'info', className = '' }) {
  return <span className={`ui-badge ui-badge--${variant} ${className}`.trim()}>{children}</span>;
}

export default Badge;
