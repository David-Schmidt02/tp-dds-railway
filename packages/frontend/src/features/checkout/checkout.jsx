import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCheckoutData } from './hooks/useCheckoutData';
import { useCart } from '../../context/cartContext';
import CheckoutHeader from './components/CheckoutHeader';
import SuccessConfirmation from './components/SuccessConfirmation';
import FailureConfirmation from './components/FailureConfirmation';
import FormUsuario from './pages/FormUsuario';
import FormDireccion from './pages/FormDireccion';
import FormPago from './pages/FormPago';
import FormRevision from './pages/FormRevision';
import './styles/CheckoutBase.css';
import './styles/CheckoutForms.css';
import './styles/CheckoutSummary.css';
import './styles/CheckoutConfirmation.css';
import './styles/CheckoutResponsive.css';

const Checkout = () => {
  const { carrito, limpiarCarrito } = useCart();
  const checkoutData = useCheckoutData(carrito, limpiarCarrito);

  const stepAccess = {
    usuario: true,
    direccion: checkoutData.paso1Completo,
    pago: checkoutData.paso2Completo,
    revision: checkoutData.paso3Completo,
    exito: checkoutData.pedidoConfirmado,
    error: Boolean(checkoutData.pedidoError)
  };

  return (
    <div className="checkout-root">
      <div className="checkout-container">
        <CheckoutHeader stepAccess={stepAccess} pedidoConfirmado={checkoutData.pedidoConfirmado} />

        <div className="checkout-content">
          <Routes>
            <Route path="/" element={<Navigate to="usuario" replace />} />

            <Route
              path="usuario"
              element={
                <FormUsuario
                  datos={checkoutData.datos}
                  setDatos={checkoutData.setDatos}
                  paso1Completo={checkoutData.paso1Completo}
                  validaciones={checkoutData.validaciones}
                />
              }
            />

            <Route
              path="direccion"
              element={
                stepAccess.direccion ? (
                  <FormDireccion
                    direccion={checkoutData.direccion}
                    setDireccion={checkoutData.setDireccion}
                    paso2Completo={checkoutData.paso2Completo}
                    validaciones={checkoutData.validaciones}
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
                  <FormPago
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
                  <FormRevision
                    direccion={checkoutData.direccion}
                    metodoPago={checkoutData.metodoPago}
                    datosTarjeta={checkoutData.datosTarjeta}
                    handleCrearPedido={checkoutData.handleCrearPedido}
                    calcularTotal={checkoutData.calcularTotal}
                    calcularSubtotal={checkoutData.calcularSubtotal}
                    calcularEnvio={checkoutData.calcularEnvio}
                    calcularImpuestos={checkoutData.calcularImpuestos}
                    procesandoPedido={checkoutData.procesandoPedido}
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

            <Route
              path="error"
              element={
                stepAccess.error ? (
                  <FailureConfirmation
                    error={checkoutData.pedidoError}
                    onRetry={checkoutData.clearPedidoError}
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
