import React from 'react';

const CheckoutSummary = ({
  calcularSubtotal,
  calcularEnvio,
  calcularImpuestos,
  calcularTotal
}) => {
  const rows = [
    { label: 'Subtotal', value: calcularSubtotal() },
    { label: 'Envío', value: calcularEnvio() },
    { label: 'Impuestos', value: calcularImpuestos() }
  ];

  return (
    <div className="summary-right">
      <div className="price-summary">
        <h3>Pago total</h3>
        {rows.map((row) => (
          <div key={row.label} className="price-line">
            <span>{row.label}</span>
            <span>${row.value.toFixed(2)}</span>
          </div>
        ))}
        <div className="price-total">
          <span>Total</span>
          <span>${calcularTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
