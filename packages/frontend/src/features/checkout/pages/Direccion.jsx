import React from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Direccion = ({ direccion, setDireccion, paso2Completo }) => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/checkout/pago');
  };

  const handleBack = () => {
    navigate('/checkout/usuario');
  };

  return (
    <div className="form-section">
      <h2>DAR DIRECCIÓN DE ENTREGA</h2>
      <div className="form-grid">
        <TextField
          label="Calle"
          fullWidth
          margin="normal"
          value={direccion.calle}
          onChange={e => setDireccion({ ...direccion, calle: e.target.value })}
          className="form-field"
        />
        <TextField
          label="Altura"
          fullWidth
          margin="normal"
          value={direccion.numero}
          onChange={e => setDireccion({ ...direccion, numero: e.target.value })}
          className="form-field"
        />
        <div className="form-row">
          <TextField
            label="Piso / Departamento"
            margin="normal"
            value={direccion.departamento}
            onChange={e => setDireccion({ ...direccion, departamento: e.target.value })}
            className="form-field-half"
          />
          <TextField
            label="Código postal"
            margin="normal"
            value={direccion.codigoPostal}
            onChange={e => setDireccion({ ...direccion, codigoPostal: e.target.value })}
            className="form-field-half"
          />
        </div>
        <FormControl fullWidth margin="normal" className="form-field">
          <InputLabel>Localidad</InputLabel>
          <Select
            value={direccion.ciudad}
            onChange={e => setDireccion({ ...direccion, ciudad: e.target.value })}
          >
            <MenuItem value="Buenos Aires">Buenos Aires</MenuItem>
            <MenuItem value="Córdoba">Córdoba</MenuItem>
            <MenuItem value="Rosario">Rosario</MenuItem>
            <MenuItem value="La Plata">La Plata</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" className="form-field">
          <InputLabel>Provincia</InputLabel>
          <Select
            value={direccion.provincia}
            onChange={e => setDireccion({ ...direccion, provincia: e.target.value })}
          >
            <MenuItem value="Buenos Aires">Buenos Aires</MenuItem>
            <MenuItem value="Córdoba">Córdoba</MenuItem>
            <MenuItem value="Santa Fe">Santa Fe</MenuItem>
            <MenuItem value="Mendoza">Mendoza</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Referencias"
          fullWidth
          margin="normal"
          value={direccion.referencias}
          onChange={e => setDireccion({ ...direccion, referencias: e.target.value })}
          className="form-field"
        />
      </div>

      <div className="form-actions">
        <Button variant="outlined" onClick={handleBack} className="back-button">
          ATRÁS
        </Button>
        <Button variant="contained" disabled={!paso2Completo} onClick={handleNext} className="next-button">
          AVANZAR
        </Button>
      </div>
    </div>
  );
};

export default Direccion;
