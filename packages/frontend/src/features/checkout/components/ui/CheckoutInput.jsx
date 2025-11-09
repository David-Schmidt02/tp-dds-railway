import React from 'react';

const CheckoutInput = ({ label, id, type = 'text', className = '', ...props }) => (
  <label className={`checkout-field ${className}`.trim()} htmlFor={id}>
    {label && <span className="checkout-field-label">{label}</span>}
    <input id={id} type={type} className="checkout-input" {...props} />
  </label>
);

export default CheckoutInput;
