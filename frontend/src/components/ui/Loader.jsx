function Loader({ text = 'Cargando...' }) {
  return (
    <div className="ui-loader" role="status" aria-live="polite">
      <span className="ui-loader__spinner" aria-hidden="true" />
      <span className="ui-loader__text">{text}</span>
    </div>
  );
}

export default Loader;
