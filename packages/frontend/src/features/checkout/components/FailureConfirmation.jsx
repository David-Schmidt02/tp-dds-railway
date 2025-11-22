import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutButton from './ui/CheckoutButton';

const FailureConfirmation = ({ error, onRetry }) => {
  const navigate = useNavigate();

  const message = error?.message || 'No pudimos procesar tu pedido.';
  const detail =
    typeof error?.detail === 'string'
      ? error.detail
      : error?.detail?.message || error?.detail?.error || null;

  const handleReintentar = () => {
    if (onRetry) onRetry();
    navigate('/checkout/revision');
  };

  // No se llama a onRetry() aquí porque al navegar a "/" el componente Checkout
  // se desmonta completamente, destruyendo el hook y limpiando el error automáticamente

  return (
    <div className="confirmation-fail">
      <div className="fail-content">
        <div className="fail-header">
          <div className="fail-icon">!</div>
          <div>
            <p className="fail-title">No pudimos confirmar tu pedido</p>
            <p className="fail-message">{message}</p>
            {detail && <p className="fail-detail">{detail}</p>}
          </div>
        </div>

        <div className="fail-actions">
          <button onClick={() => navigate('/')} className="checkout-button secondary">
            Volver al inicio
          </button>
          <CheckoutButton type="button" onClick={handleReintentar}>
            Reintentar
          </CheckoutButton>
        </div>
      </div>
    </div>
  );
};

export default FailureConfirmation;
