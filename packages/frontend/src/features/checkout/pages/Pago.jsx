import React from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Pago = ({
  metodoPago,
  setMetodoPago,
  aceptaTerminos,
  setAceptaTerminos,
  datosTarjeta,
  setDatosTarjeta,
  paso3Completo
}) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/checkout/revision');
  };

  const handleBack = () => {
    navigate('/checkout/direccion');
  };

  return (
    <div className="payment-section">
      <h2>ELIGE TU MÉTODO DE PAGO</h2>

      <FormControl component="fieldset" className="payment-methods">
        <RadioGroup
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <FormControlLabel
            value="tarjeta"
            control={<Radio />}
            label="Tarjeta de crédito o débito"
            className="payment-option"
          />

          {metodoPago === 'tarjeta' && (
            <div className="card-details">
              <div className="card-type-selection">
                <FormControl component="fieldset" className="card-type-radio">
                  <RadioGroup
                    row
                    value={datosTarjeta.tipoTarjeta}
                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, tipoTarjeta: e.target.value })}
                  >
                    <FormControlLabel
                      value="credito"
                      control={<Radio size="small" />}
                      label="Crédito"
                      className="card-type-option"
                    />
                    <FormControlLabel
                      value="debito"
                      control={<Radio size="small" />}
                      label="Débito"
                      className="card-type-option"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <div className="card-form">
                <TextField
                  label="Número de tarjeta"
                  fullWidth
                  margin="normal"
                  value={datosTarjeta.numeroTarjeta}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                    const valorFormateado = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
                    if (valor.length <= 16) {
                      setDatosTarjeta({ ...datosTarjeta, numeroTarjeta: valorFormateado });
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  inputProps={{ maxLength: 19 }}
                  className="card-field"
                />

                <TextField
                  label="Nombre del titular"
                  fullWidth
                  margin="normal"
                  value={datosTarjeta.nombreTitular}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombreTitular: e.target.value.toUpperCase() })}
                  placeholder="JUAN PÉREZ"
                  className="card-field"
                />

                <div className="card-row">
                  <TextField
                    label="Fecha de vencimiento"
                    margin="normal"
                    value={datosTarjeta.fechaVencimiento}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, '');
                      let valorFormateado = valor;
                      if (valor.length >= 2) {
                        valorFormateado = valor.substring(0, 2) + '/' + valor.substring(2, 4);
                      }
                      if (valor.length <= 4) {
                        setDatosTarjeta({ ...datosTarjeta, fechaVencimiento: valorFormateado });
                      }
                    }}
                    placeholder="MM/YY"
                    inputProps={{ maxLength: 5 }}
                    className="card-field-half"
                  />

                  <TextField
                    label="Código de seguridad"
                    margin="normal"
                    value={datosTarjeta.codigoSeguridad}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, '');
                      if (valor.length <= 4) {
                        setDatosTarjeta({ ...datosTarjeta, codigoSeguridad: valor });
                      }
                    }}
                    placeholder="123"
                    inputProps={{ maxLength: 4, type: 'password' }}
                    className="card-field-half"
                  />
                </div>
              </div>
            </div>
          )}

          <FormControlLabel
            value="transferencia"
            control={<Radio />}
            label="Transferencia bancaria"
            className="payment-option"
          />
          <FormControlLabel
            value="efectivo"
            control={<Radio />}
            label="Efectivo / Pago en ventanilla"
            className="payment-option"
          />
        </RadioGroup>
      </FormControl>

      <div className="terms-notice">
        <p>POR FAVOR METES LOS DATOS DE LA TARJETA (GENÉRICO)</p>
      </div>

      <div className="form-checkbox">
        <FormControlLabel
          control={<Checkbox checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} />}
          label="Acepto términos y condiciones"
        />
      </div>

      <div className="form-actions">
        <Button variant="outlined" onClick={handleBack} className="back-button">
          ATRÁS
        </Button>
        <Button variant="contained" disabled={!paso3Completo} onClick={handleNext} className="next-button">
          AVANZAR
        </Button>
      </div>
    </div>
  );
};

export default Pago;
