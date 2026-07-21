import React from 'react';

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export default Button;
