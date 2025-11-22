import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutInput from '../components/ui/CheckoutInput';
import CheckoutButton from '../components/ui/CheckoutButton';
import CheckoutCheckbox from '../components/ui/CheckoutCheckbox';

const FormUsuario = ({ datos, setDatos, paso1Completo, validaciones }) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/checkout/direccion');
  };

  const getEmailError = () => {
    if (!datos.email) return '';
    if (!validaciones.esEmailValido(datos.email)) {
      return 'Formato de email inválido';
    }
    return '';
  };

  const getTelefonoError = () => {
    if (!datos.telefono) return '';
    if (!validaciones.esTelefonoValido(datos.telefono)) {
      return 'Debe contener entre 8 y 15 dígitos';
    }
    return '';
  };

  const getTextFieldError = (value, minLength = 2) => {
    if (!value) return '';
    if (!validaciones.esTextoValido(value, minLength)) {
      return `Debe tener al menos ${minLength} caracteres`;
    }
    return '';
  };

  return (
    <div className="form-section">
      <h2>Introduce tus datos</h2>
      <div className="form-grid">
        <CheckoutInput
          label="Nombre"
          id="nombre"
          value={datos.nombre}
          onChange={e => setDatos({ ...datos, nombre: e.target.value })}
          error={getTextFieldError(datos.nombre, 2)}
        />
        <CheckoutInput
          label="Apellido"
          id="apellido"
          value={datos.apellido}
          onChange={e => setDatos({ ...datos, apellido: e.target.value })}
          error={getTextFieldError(datos.apellido, 2)}
        />
        <CheckoutInput
          label="Email"
          id="email"
          type="email"
          value={datos.email}
          onChange={e => setDatos({ ...datos, email: e.target.value })}
          error={getEmailError()}
        />
        <CheckoutInput
          label="Teléfono"
          id="telefono"
          type="tel"
          value={datos.telefono}
          onChange={e => setDatos({ ...datos, telefono: e.target.value })}
          error={getTelefonoError()}
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
          Avanzar
        </CheckoutButton>
      </div>
    </div>
  );
};

export default FormUsuario;
