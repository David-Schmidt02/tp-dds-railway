import React from 'react';

const CheckoutSelect = ({
  label,
  id,
  options = [],
  placeholder = 'Seleccionar',
  className = '',
  ...props
}) => (
  <label className={`checkout-field ${className}`.trim()} htmlFor={id}>
    {label && <span className="checkout-field-label">{label}</span>}
    <select id={id} className="checkout-select" {...props}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map(({ value, label: text }) => (
        <option key={value} value={value}>
          {text}
        </option>
      ))}
    </select>
  </label>
);

export default CheckoutSelect;
