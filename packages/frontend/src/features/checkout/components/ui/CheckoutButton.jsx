import React from 'react';

const CheckoutButton = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => (
  <button
    className={`checkout-button checkout-button--${variant} ${className}`.trim()}
    {...props}
  >
    {children}
  </button>
);

export default CheckoutButton;
