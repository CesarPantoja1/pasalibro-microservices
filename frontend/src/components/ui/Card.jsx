import React from 'react';

function Card({ children, className = '', hoverable = false, onClick }) {
  const classes = [
    'ui-card',
    hoverable ? 'ui-card--hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes} onClick={onClick}>
      {children}
    </article>
  );
}

export default Card;
