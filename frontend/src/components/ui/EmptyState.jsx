import React from 'react';
import Button from './Button.jsx';

function EmptyState({ icon = '📚', title, description, actionLabel, onAction }) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-state__icon">{icon}</div>
      <h3 className="ui-empty-state__title">{title}</h3>
      <p className="ui-empty-state__description">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
