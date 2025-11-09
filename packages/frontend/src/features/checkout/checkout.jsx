import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCheckoutData } from './hooks/useCheckoutData';
import CheckoutHeader from './components/CheckoutHeader';
import SuccessConfirmation from './components/SuccessConfirmation';
import Usuario from './pages/Usuario';
import Direccion from './pages/Direccion';
import Pago from './pages/Pago';
import Revision from './pages/Revision';
import './styles/CheckoutBase.css';
import './styles/CheckoutForms.css';
import './styles/CheckoutSummary.css';
import './styles/CheckoutConfirmation.css';
import './styles/CheckoutResponsive.css';

const Checkout = ({ carrito, limpiarCarrito }) => {
  const checkoutData = useCheckoutData(carrito, limpiarCarrito);

  const stepAccess = {
    usuario: true,
    direccion: checkoutData.paso1Completo,
    pago: checkoutData.paso2Completo,
    revision: checkoutData.paso3Completo,
    exito: checkoutData.pedidoConfirmado
  };

  return (
    <div className="checkout-root">
      <div className="checkout-container">
        <CheckoutHeader stepAccess={stepAccess} />

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
                stepAccess.direccion ? (
                  <Direccion
                    direccion={checkoutData.direccion}
                    setDireccion={checkoutData.setDireccion}
                    paso2Completo={checkoutData.paso2Completo}
                  />
                ) : (
                  <Navigate to="/checkout/usuario" replace />
                )
              }
            />

            <Route
              path="pago"
              element={
                stepAccess.pago ? (
                  <Pago
                    metodoPago={checkoutData.metodoPago}
                    setMetodoPago={checkoutData.setMetodoPago}
                    aceptaTerminos={checkoutData.aceptaTerminos}
                    setAceptaTerminos={checkoutData.setAceptaTerminos}
                    datosTarjeta={checkoutData.datosTarjeta}
                    setDatosTarjeta={checkoutData.setDatosTarjeta}
                    paso3Completo={checkoutData.paso3Completo}
                  />
                ) : (
                  <Navigate to="/checkout/direccion" replace />
                )
              }
            />

            <Route
              path="revision"
              element={
                stepAccess.revision ? (
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
                ) : (
                  <Navigate to="/checkout/pago" replace />
                )
              }
            />

            <Route
              path="exito"
              element={
                stepAccess.exito ? (
                  <SuccessConfirmation
                    pedido={checkoutData.pedidoCreado}
                    calcularTotal={checkoutData.calcularTotal}
                    fallbackDireccion={checkoutData.direccion}
                  />
                ) : (
                  <Navigate to="/checkout/revision" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
