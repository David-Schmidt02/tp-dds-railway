import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutInput from '../components/ui/CheckoutInput';
import CheckoutButton from '../components/ui/CheckoutButton';
import CheckoutSelect from '../components/ui/CheckoutSelect';

const ciudades = [
  { value: 'Buenos Aires', label: 'Buenos Aires' },
  { value: 'Cordoba', label: 'Córdoba' },
  { value: 'Rosario', label: 'Rosario' },
  { value: 'La Plata', label: 'La Plata' }
];

const provincias = [
  { value: 'Buenos Aires', label: 'Buenos Aires' },
  { value: 'Cordoba', label: 'Córdoba' },
  { value: 'Santa Fe', label: 'Santa Fe' },
  { value: 'Mendoza', label: 'Mendoza' }
];

const Direccion = ({ direccion, setDireccion, paso2Completo }) => {
  const navigate = useNavigate();

  const handleNext = () => navigate('/checkout/pago');
  const handleBack = () => navigate('/checkout/usuario');

  return (
    <div className="form-section">
      <h2>DAR DIRECCIÓN DE ENTREGA</h2>
      <div className="form-grid">
        <CheckoutInput
          label="Calle"
          id="calle"
          value={direccion.calle}
          onChange={e => setDireccion({ ...direccion, calle: e.target.value })}
        />
        <CheckoutInput
          label="Altura"
          id="altura"
          value={direccion.numero}
          onChange={e => setDireccion({ ...direccion, numero: e.target.value })}
        />
        <div className="form-row">
          <CheckoutInput
            label="Piso / Departamento"
            id="departamento"
            value={direccion.departamento}
            onChange={e => setDireccion({ ...direccion, departamento: e.target.value })}
            className="form-field-half"
          />
          <CheckoutInput
            label="Código postal"
            id="codigo-postal"
            value={direccion.codigoPostal}
            onChange={e => setDireccion({ ...direccion, codigoPostal: e.target.value })}
            className="form-field-half"
          />
        </div>

        <CheckoutSelect
          label="Localidad"
          id="ciudad"
          value={direccion.ciudad}
          onChange={e => setDireccion({ ...direccion, ciudad: e.target.value })}
          options={ciudades}
        />

        <CheckoutSelect
          label="Provincia"
          id="provincia"
          value={direccion.provincia}
          onChange={e => setDireccion({ ...direccion, provincia: e.target.value })}
          options={provincias}
        />

        <CheckoutInput
          label="Referencias"
          id="referencias"
          value={direccion.referencias}
          onChange={e => setDireccion({ ...direccion, referencias: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <CheckoutButton variant="secondary" type="button" onClick={handleBack}>
          ATRÁS
        </CheckoutButton>
        <CheckoutButton
          type="button"
          disabled={!paso2Completo}
          onClick={handleNext}
        >
          AVANZAR
        </CheckoutButton>
      </div>
    </div>
  );
};

export default Direccion;
