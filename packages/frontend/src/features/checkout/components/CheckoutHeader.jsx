import React from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutHeader = () => {
  const location = useLocation();
  const path = location.pathname;

  const pasos = [
    { nombre: 'Usuario', ruta: '/checkout/usuario' },
    { nombre: 'Direccion', ruta: '/checkout/direccion' },
    { nombre: 'Pago', ruta: '/checkout/pago' },
    { nombre: 'Revision', ruta: '/checkout/revision' }
  ];

  const pasoActualIndex = pasos.findIndex(p => path.includes(p.ruta.split('/')[2]));

  return (
    <div className="checkout-header">
      <h1>CHECKOUT</h1>
      <div className="step-indicators">
        {pasos.map((paso, index) => (
          <React.Fragment key={paso.nombre}>
            <span className={`step ${pasoActualIndex >= index ? 'active' : ''} ${path.includes('exito') ? 'completed' : ''}`}>
              {paso.nombre}
            </span>
            {index < pasos.length - 1 && <span className="divider"></span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutHeader;
