import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCheckoutData } from './hooks/useCheckoutData';
import CheckoutHeader from './components/CheckoutHeader';
import SuccessConfirmation from './components/SuccessConfirmation';
import Usuario from './pages/Usuario';
import Direccion from './pages/Direccion';
import Pago from './pages/Pago';
import Revision from './pages/Revision';
import './Checkout.css';

const Checkout = ({ carrito, limpiarCarrito }) => {
  const checkoutData = useCheckoutData(carrito, limpiarCarrito);

  return (
    <div className="checkout-root">
      <div className="checkout-container">
        <CheckoutHeader />

        <div className="checkout-content">
          <Routes>
            <Route path="/" element={<Navigate to="usuario" replace />} />

            <Route
              path="usuario"
              element={
                <Usuario
                  datos={checkoutData.datos}
                  setDatos={checkoutData.setDatos}
                  paso1Completo={checkoutData.paso1Completo}
                />
              }
            />

            <Route
              path="direccion"
              element={
                <Direccion
                  direccion={checkoutData.direccion}
                  setDireccion={checkoutData.setDireccion}
                  paso2Completo={checkoutData.paso2Completo}
                />
              }
            />

            <Route
              path="pago"
              element={
                <Pago
                  metodoPago={checkoutData.metodoPago}
                  setMetodoPago={checkoutData.setMetodoPago}
                  aceptaTerminos={checkoutData.aceptaTerminos}
                  setAceptaTerminos={checkoutData.setAceptaTerminos}
                  datosTarjeta={checkoutData.datosTarjeta}
                  setDatosTarjeta={checkoutData.setDatosTarjeta}
                  paso3Completo={checkoutData.paso3Completo}
                />
              }
            />

            <Route
              path="revision"
              element={
                <Revision
                  direccion={checkoutData.direccion}
                  metodoPago={checkoutData.metodoPago}
                  datosTarjeta={checkoutData.datosTarjeta}
                  handleCrearPedido={checkoutData.handleCrearPedido}
                  calcularTotal={checkoutData.calcularTotal}
                  calcularSubtotal={checkoutData.calcularSubtotal}
                  calcularEnvio={checkoutData.calcularEnvio}
                  calcularImpuestos={checkoutData.calcularImpuestos}
                />
              }
            />

            <Route
              path="exito"
              element={
                <SuccessConfirmation
                  calcularTotal={checkoutData.calcularTotal}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
