import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutHeader = ({ stepAccess = {}, pedidoConfirmado = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const pasos = [
    { nombre: 'Usuario', ruta: '/checkout/usuario', slug: 'usuario' },
    { nombre: 'Direccion', ruta: '/checkout/direccion', slug: 'direccion' },
    { nombre: 'Pago', ruta: '/checkout/pago', slug: 'pago' },
    { nombre: 'Revision', ruta: '/checkout/revision', slug: 'revision' }
  ];

  const pasoActualIndex = pasos.findIndex(p => path.includes(p.slug));
  const indexActivo = pasoActualIndex === -1 ? pasos.length - 1 : pasoActualIndex;
  const checkoutFinalizado = path.includes('exito');

  const canAccess = (index) => {
    if (index === 0) return true;
    const slug = pasos[index].slug;
    return Boolean(stepAccess[slug]);
  };

  const handleStepClick = (paso, index) => {
    if (!canAccess(index) || pedidoConfirmado) return;
    navigate(paso.ruta);
  };

  return (
    <div className="checkout-header">
      <h1>Checkout</h1>
      <div className="step-indicators">
        {pasos.map((paso, index) => (
          <React.Fragment key={paso.nombre}>
            <button
              type="button"
              // Clases CSS dinámicas según estado: -> Modifican los estilos de los indicadores superiores del checkout
              // - 'completed': paso ya completado (checkout finalizado o índice menor al actual)
              // - 'active': paso actual en progreso (no finalizado)
              // - 'disabled': paso no accesible aún
              className={`step-chip ${
                checkoutFinalizado || index < indexActivo ? 'completed' : ''
              } ${index === indexActivo && !checkoutFinalizado ? 'active' : ''} ${
                canAccess(index) && !pedidoConfirmado ? '' : 'disabled'
              }`}
              onClick={() => handleStepClick(paso, index)}
              disabled={!canAccess(index) || pedidoConfirmado}
            >
              <span>{paso.nombre}</span>
            </button>
            {index < pasos.length - 1 && <span className="divider"></span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutHeader;
