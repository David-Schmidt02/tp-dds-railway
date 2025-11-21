import React from 'react';
import { Link } from 'react-router-dom';
import CheckoutButton from './ui/CheckoutButton';

const formatDireccion = (direccion) => {
  if (!direccion) return 'Sin dirección registrada';
  const partes = [
    `${direccion.calle || ''} ${direccion.numero || ''}`.trim(),
    `${direccion.ciudad || ''}${direccion.ciudad ? ',' : ''} ${direccion.provincia || ''}`.trim(),
    direccion.codigoPostal ? `CP ${direccion.codigoPostal}` : ''
  ].filter(Boolean);
  return partes.length ? partes.join(' · ') : 'Sin dirección registrada';
};

const SuccessConfirmation = ({ pedido, calcularTotal, fallbackDireccion }) => {
  const total = (pedido?.total ?? calcularTotal()).toFixed(2);
  const fecha = pedido?.fechaCreacion
    ? new Date(pedido.fechaCreacion)
    : new Date();

  const numeroPedido = pedido?.id
    ? `PED-${pedido.id.slice(-6).toUpperCase()}`
    : 'PED-000000';

  const direccion = formatDireccion(pedido?.direccionEntrega || fallbackDireccion);

  return (
    <div className="confirmation-success">
      <div className="success-content">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <div>
            <p className="success-title">Pedido confirmado</p>
            <p className="success-number">Número: {numeroPedido}</p>
          </div>
        </div>

        <div className="success-summary">
          <div>
            <span className="success-label">Fecha</span>
            <p>{fecha.toLocaleString('es-AR')}</p>
          </div>
          <div>
            <span className="success-label">Dirección</span>
            <p>{direccion}</p>
          </div>
          <div>
            <span className="success-label">Total</span>
            <p className="success-total">${total}</p>
          </div>
        </div>

        <p className="success-note">
          Te enviamos la confirmación a la casilla registrada en tu cuenta.
        </p>

        <Link to="/" className="checkout-button">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default SuccessConfirmation;
