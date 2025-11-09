import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckoutSummary from '../components/CheckoutSummary';

const Revision = ({
  direccion,
  metodoPago,
  datosTarjeta,
  handleCrearPedido,
  calcularTotal,
  calcularSubtotal,
  calcularEnvio,
  calcularImpuestos
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/checkout/pago');
  };

  const handleConfirmar = async () => {
    await handleCrearPedido();
  };

  return (
    <div className="summary-section">
      <div className="summary-content">
        <div className="summary-left">
          <h2>REVISIÓN Y CONFIRMACIÓN</h2>

          <div className="summary-block">
            <h3>DIRECCIÓN DE ENTREGA</h3>
            <p>{direccion.calle} {direccion.numero}</p>
            <p>{direccion.ciudad}, {direccion.provincia} {direccion.codigoPostal}</p>
            {direccion.departamento && <p>Depto: {direccion.departamento}</p>}
            {direccion.referencias && <p>Ref: {direccion.referencias}</p>}
          </div>

          <div className="summary-block">
            <h3>MÉTODO DE PAGO</h3>
            {metodoPago === 'tarjeta' ? (
              <>
                <p>Tarjeta de {datosTarjeta.tipoTarjeta === 'credito' ? 'crédito' : 'débito'}</p>
                <p>**** **** **** {datosTarjeta.numeroTarjeta.slice(-4)}</p>
                <p>{datosTarjeta.nombreTitular}</p>
                <p>Vence: {datosTarjeta.fechaVencimiento}</p>
              </>
            ) : (
              <p>{metodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo / Pago en ventanilla'}</p>
            )}
            <p>Acepta términos y condiciones</p>
          </div>

          <div className="form-actions">
            <Button variant="outlined" onClick={handleBack} className="back-button">
              ATRÁS
            </Button>
            <Button variant="contained" onClick={handleConfirmar} className="confirm-button">
              ACEPTAR
            </Button>
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

export default Revision;
