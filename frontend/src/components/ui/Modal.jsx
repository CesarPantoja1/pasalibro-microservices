// Modal reutilizable con controls básicos de apertura y cierre.
function Modal({ open, onClose, title, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-modal" role="dialog" aria-modal="true">
      <div className="ui-modal__backdrop" onClick={onClose} />
      <div className="ui-modal__panel">
        <div className="ui-modal__header">
          <h3 className="ui-modal__title">{title}</h3>
          <button type="button" className="ui-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ui-modal__content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
