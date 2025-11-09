import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutInput from '../components/ui/CheckoutInput';
import CheckoutButton from '../components/ui/CheckoutButton';
import CheckoutCheckbox from '../components/ui/CheckoutCheckbox';

const Usuario = ({ datos, setDatos, paso1Completo }) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/checkout/direccion');
  };

  return (
    <div className="form-section">
      <h2>INTRODUCE TUS DATOS</h2>
      <div className="form-grid">
        <CheckoutInput
          label="Nombre"
          id="nombre"
          value={datos.nombre}
          onChange={e => setDatos({ ...datos, nombre: e.target.value })}
        />
        <CheckoutInput
          label="Apellido"
          id="apellido"
          value={datos.apellido}
          onChange={e => setDatos({ ...datos, apellido: e.target.value })}
        />
        <CheckoutInput
          label="Email"
          id="email"
          type="email"
          value={datos.email}
          onChange={e => setDatos({ ...datos, email: e.target.value })}
        />
        <CheckoutInput
          label="Teléfono"
          id="telefono"
          type="tel"
          value={datos.telefono}
          onChange={e => setDatos({ ...datos, telefono: e.target.value })}
        />
      </div>

      <div className="form-checkbox">
        <CheckoutCheckbox
          id="guardar-datos"
          label="Guardar mis datos"
        />
      </div>

      <div className="form-actions">
        <CheckoutButton
          type="button"
          disabled={!paso1Completo}
          onClick={handleNext}
        >
          AVANZAR
        </CheckoutButton>
      </div>
    </div>
  );
};

export default Usuario;
