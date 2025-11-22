import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutInput from '../components/ui/CheckoutInput';
import CheckoutButton from '../components/ui/CheckoutButton';
import CheckoutCheckbox from '../components/ui/CheckoutCheckbox';

const paymentOptions = [
  { value: 'tarjeta', label: 'Tarjeta de crédito / débito' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'efectivo', label: 'Efectivo / Pago en ventanilla' }
];

const FormPago = ({
  metodoPago,
  setMetodoPago,
  aceptaTerminos,
  setAceptaTerminos,
  datosTarjeta,
  setDatosTarjeta,
  paso3Completo
}) => {
  const navigate = useNavigate();

  const handleNext = () => navigate('/checkout/revision');
  const handleBack = () => navigate('/checkout/direccion');

  const formatCardNumber = (valor) => {
    const limpio = valor.replace(/\s/g, '').replace(/\D/g, '');
    const visible = limpio.replace(/(\d{4})(?=\d)/g, '$1 ');
    return limpio.length <= 16 ? visible : datosTarjeta.numeroTarjeta;
  };

  const formatExpiry = (valor) => {
    const limpio = valor.replace(/\D/g, '').slice(0, 4);
    if (limpio.length <= 2) return limpio;
    return `${limpio.slice(0, 2)}/${limpio.slice(2, 4)}`;
  };

  const handleCardField = (field, value) => {
    setDatosTarjeta({ ...datosTarjeta, [field]: value });
  };

  const cardDetails = metodoPago !== 'tarjeta' ? null : (
    <div className="card-details">
      <div className="card-type-selection">
        {['credito', 'debito'].map((tipo) => (
          <label key={tipo} className={`checkout-radio small ${datosTarjeta.tipoTarjeta === tipo ? 'checked' : ''}`}>
            <input
              type="radio"
              value={tipo}
              checked={datosTarjeta.tipoTarjeta === tipo}
              onChange={e => handleCardField('tipoTarjeta', e.target.value)}
            />
            <span>{tipo === 'credito' ? 'Crédito' : 'Débito'}</span>
          </label>
        ))}
      </div>

      <div className="card-form">
        <CheckoutInput
          label="Número de tarjeta"
          id="numero-tarjeta"
          value={datosTarjeta.numeroTarjeta}
          onChange={e => handleCardField('numeroTarjeta', formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />

        <CheckoutInput
          label="Nombre del titular"
          id="nombre-titular"
          value={datosTarjeta.nombreTitular}
          onChange={e => handleCardField('nombreTitular', e.target.value.toUpperCase())}
          placeholder="JUAN PÉREZ"
        />

        <div className="card-row">
          <CheckoutInput
            label="Fecha de vencimiento"
            id="fecha-vencimiento"
            value={datosTarjeta.fechaVencimiento}
            onChange={e => handleCardField('fechaVencimiento', formatExpiry(e.target.value))}
            placeholder="MM/AA"
            maxLength={5}
            className="form-field-half"
          />

          <CheckoutInput
            label="Código de seguridad"
            id="codigo-seguridad"
            value={datosTarjeta.codigoSeguridad}
            onChange={e => handleCardField('codigoSeguridad', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            className="form-field-half"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="payment-section">
      <h2>Elegí tu método de pago</h2>

      <div className="payment-methods">
        {paymentOptions.map(option => (
          <div key={option.value} className="payment-option">
            <label className={`checkout-radio ${metodoPago === option.value ? 'checked' : ''}`}>
              <input
                type="radio"
                value={option.value}
                checked={metodoPago === option.value}
                onChange={e => setMetodoPago(e.target.value)}
              />
              <span>{option.label}</span>
            </label>
            {option.value === 'tarjeta' && cardDetails}
          </div>
        ))}
      </div>

      <div className="form-checkbox">
        <CheckoutCheckbox
          id="acepta-terminos"
          label="Acepto términos y condiciones"
          checked={aceptaTerminos}
          onChange={e => setAceptaTerminos(e.target.checked)}
        />
      </div>

      <div className="form-actions">
        <CheckoutButton className="secondary" type="button" onClick={handleBack}>
          Atrás
        </CheckoutButton>
        <CheckoutButton
          type="button"
          disabled={!paso3Completo}
          onClick={handleNext}
        >
          Avanzar
        </CheckoutButton>
      </div>
    </div>
  );
};

export default FormPago;
