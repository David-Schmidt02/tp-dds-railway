import React from 'react';

const CartSummary = ({ cantidadTotal, total, onCheckout }) => {
  return (
    <div className="cart-summary">
      <div className="summary-card">
        <h2>Resumen del Pedido</h2>
        <div className="summary-row">
          <span>Productos ({cantidadTotal})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={onCheckout}>
          Continuar Compra
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
