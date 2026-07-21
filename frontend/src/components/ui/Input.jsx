import React from 'react';

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  className = '',
}) {
  return (
    <label className={`ui-field ${className}`.trim()}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`ui-input ${error ? 'ui-input--error' : ''}`.trim()}
      />
      {error ? <span className="ui-field__error">{error}</span> : null}
    </label>
  );
}

export default Input;
