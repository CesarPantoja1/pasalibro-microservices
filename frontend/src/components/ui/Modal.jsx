import React from 'react';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="ui-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="ui-modal__backdrop" onClick={onClose} />
      <div className="ui-modal__panel">
        <div className="ui-modal__header">
          <h3 className="ui-modal__title" id="modal-title">{title}</h3>
          <button
            type="button"
            className="ui-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="ui-modal__content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
