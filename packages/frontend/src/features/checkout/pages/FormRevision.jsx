import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import CheckoutButton from '../components/ui/CheckoutButton';
import CheckoutSummary from '../components/CheckoutSummary';

const FormRevision = ({
  direccion,
  metodoPago,
  datosTarjeta,
  handleCrearPedido,
  calcularTotal,
  calcularSubtotal,
  calcularEnvio,
  calcularImpuestos,
  procesandoPedido
}) => {
  const navigate = useNavigate();

  const handleBack = () => navigate('/checkout/pago');

  // Es trivial, pero mantiene consistencia
  const handleConfirmar = async () => {
    await handleCrearPedido();
  };

  const tarjetaSeleccionada = metodoPago === 'tarjeta';

  return (
    <div className="summary-section">
      {procesandoPedido && <LinearProgress />}
      <div className="summary-content">
        <div className="summary-left">
          <h2>Revisión y confirmación</h2>

          <div className="summary-block">
            <h3>Dirección de entrega</h3>
            <p>{`${direccion.calle} ${direccion.numero}`.trim()}</p>
            {/* Formato: "Ciudad, Provincia CP" - solo agrega coma si hay ciudad */}
            <p>{`${direccion.ciudad || ''}${direccion.ciudad ? ',' : ''} ${direccion.provincia || ''} ${direccion.codigoPostal || ''}`.trim()}</p>
            {direccion.departamento && <p>Depto: {direccion.departamento}</p>}
            {direccion.referencias && <p>Ref: {direccion.referencias}</p>}
          </div>

          <div className="summary-block">
            <h3>Método de pago</h3>
            {tarjetaSeleccionada ? (
              <>
                <p>Tarjeta de {datosTarjeta.tipoTarjeta === 'credito' ? 'crédito' : 'débito'}</p>
                <p>**** **** **** {datosTarjeta.numeroTarjeta.slice(-4)}</p>
                <p>{datosTarjeta.nombreTitular}</p>
                <p>Vence: {datosTarjeta.fechaVencimiento}</p>
              </>
            ) : (
              <p>
                {metodoPago === 'transferencia'
                  ? 'Transferencia bancaria'
                  : 'Efectivo / Pago en ventanilla'}
              </p>
            )}
            <p>Acepto términos y condiciones</p>
          </div>

          <div className="form-actions">
            <CheckoutButton className="secondary" type="button" onClick={handleBack} disabled={procesandoPedido}>
              Atrás
            </CheckoutButton>
            <CheckoutButton type="button" onClick={handleConfirmar} disabled={procesandoPedido}>
              Aceptar
            </CheckoutButton>
          </div>
        </div>

        <CheckoutSummary
          calcularSubtotal={calcularSubtotal}
          calcularEnvio={calcularEnvio}
          calcularImpuestos={calcularImpuestos}
          calcularTotal={calcularTotal}
        />
      </div>
    </div>
  );
};

export default FormRevision;
