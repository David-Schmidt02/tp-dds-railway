import React from 'react';

const CheckoutCheckbox = ({ label, id, className = '', ...props }) => (
  <label className={`checkout-checkbox ${className}`.trim()} htmlFor={id}>
    <input id={id} type="checkbox" {...props} />
    {label && <span>{label}</span>}
  </label>
);

export default CheckoutCheckbox;
