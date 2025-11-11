import React from 'react';

const CheckoutInput = ({ label, id, type = 'text', className = '', error, ...props }) => (
  <label className={`checkout-field ${className}`.trim()} htmlFor={id}>
    {label && <span className="checkout-field-label">{label}</span>}
    <input
      id={id}
      type={type}
      className={`checkout-input ${error ? 'checkout-input-error' : ''}`}
      {...props}
    />
    {error && <span className="checkout-field-error">{error}</span>}
  </label>
);

export default CheckoutInput;
