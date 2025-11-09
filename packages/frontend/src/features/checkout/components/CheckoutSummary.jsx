import React from 'react';

const CheckoutSummary = ({ calcularSubtotal, calcularEnvio, calcularImpuestos, calcularTotal }) => {
  return (
    <div className="summary-right">
      <div className="price-summary">
        <h3>PAGO TOTAL</h3>
        <div className="price-line">
          <span>Subtotal</span>
          <span>${calcularSubtotal().toFixed(2)}</span>
        </div>
        <div className="price-line">
          <span>Envío/ID:</span>
          <span>${calcularEnvio().toFixed(2)}</span>
        </div>
        <div className="price-line">
          <span>Impuestos/ID:</span>
          <span>${calcularImpuestos().toFixed(2)}</span>
        </div>
        <div className="price-total">
          <span><strong>Total</strong></span>
          <span><strong>${calcularTotal().toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
