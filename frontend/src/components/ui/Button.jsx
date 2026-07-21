import React from 'react';

function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = '',
  className = '',
}) {
  const classes = [
    'ui-button',
    `ui-button--${variant}`,
    size ? `ui-button--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export default Button;
