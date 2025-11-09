import React from 'react';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Usuario = ({ datos, setDatos, paso1Completo }) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/checkout/direccion');
  };

  return (
    <div className="form-section">
      <h2>INTRODUCE TUS DATOS</h2>
      <div className="form-grid">
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={datos.nombre}
          onChange={e => setDatos({ ...datos, nombre: e.target.value })}
          className="form-field"
        />
        <TextField
          label="Apellido"
          fullWidth
          margin="normal"
          value={datos.apellido}
          onChange={e => setDatos({ ...datos, apellido: e.target.value })}
          className="form-field"
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={datos.email}
          onChange={e => setDatos({ ...datos, email: e.target.value })}
          className="form-field"
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="normal"
          value={datos.telefono}
          onChange={e => setDatos({ ...datos, telefono: e.target.value })}
          className="form-field"
        />
      </div>

      <div className="form-checkbox">
        <FormControlLabel
          control={<Checkbox />}
          label="Guardar mis datos"
        />
      </div>

      <div className="form-actions">
        <Button variant="contained" disabled={!paso1Completo} onClick={handleNext} className="next-button">
          AVANZAR
        </Button>
      </div>
    </div>
  );
};

export default Usuario;
