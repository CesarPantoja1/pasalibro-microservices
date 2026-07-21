import React from 'react';

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  name,
  error,
  disabled = false,
  className = '',
}) {
  return (
    <label className={`ui-field ${className}`.trim()}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`ui-input${error ? ' ui-input--error' : ''}`}
      />
      {error ? <span className="ui-field__error">{error}</span> : null}
    </label>
  );
}

export default Input;
