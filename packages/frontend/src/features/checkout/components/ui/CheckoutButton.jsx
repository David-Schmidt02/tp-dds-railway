import React from 'react';

const CheckoutButton = ({
  children,
  className = '',
  ...props
}) => (
  <button
    className={`checkout-button ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
);

export default CheckoutButton;
