import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SuccessConfirmation = ({ calcularTotal }) => {
  const navigate = useNavigate();

  const handleVolverAHome = () => {
    navigate('/');
  };

  return (
    <div className="confirmation-success">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h2>Pedido confirmado</h2>
        <p>Total <strong>${calcularTotal().toFixed(2)}</strong></p>

        <div className="order-details">
          <p><strong>{new Date().toLocaleString('es-AR')}</strong></p>
          <p>Sin dirección registrada</p>
        </div>

        <div className="success-actions">
          <Button variant="contained" className="success-button" onClick={handleVolverAHome}>
            Ver comprobante
          </Button>
          <Button variant="text" className="email-button">
            Reenviar email
          </Button>
        </div>

        <p className="success-note">Se almacenó la confirmación de compra asociada a tu cuenta.</p>
      </div>
    </div>
  );
};

export default SuccessConfirmation;
