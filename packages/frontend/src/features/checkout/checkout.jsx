import React, { useState } from 'react';
import { Card, Button, TextField, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './checkout.css';

const pasos = ['Tus Datos', 'Dirección de Entrega', 'Resumen'];

const Checkout = ({ carrito, limpiarCarrito }) => {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(0);

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
  });

  const [direccion, setDireccion] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
  });

  const handleNext = () => setPaso(prev => prev + 1);
  const handleBack = () => setPaso(prev => prev - 1);

  const handleCrearPedido = () => {
    limpiarCarrito();
    navigate('/');
  };

  const paso1Completo = datos.nombre && datos.apellido && datos.email;
  const paso2Completo =
    direccion.calle && direccion.numero && direccion.ciudad && direccion.provincia && direccion.codigoPostal;

  return (
    <div className="checkout-root">
      <Stepper activeStep={paso} alternativeLabel className="stepper">
        {pasos.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card className="checkout-card">
        {paso === 0 && (
          <div className="form">
            <TextField label="Nombre" fullWidth margin="normal" value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })} />
            <TextField label="Apellido" fullWidth margin="normal" value={datos.apellido} onChange={e => setDatos({ ...datos, apellido: e.target.value })} />
            <TextField label="Email" type="email" fullWidth margin="normal" value={datos.email} onChange={e => setDatos({ ...datos, email: e.target.value })} />

            <div className="actions">
              <Button disabled>Volver</Button>
              <Button variant="contained" disabled={!paso1Completo} onClick={handleNext}>Siguiente</Button>
            </div>
          </div>
        )}

        {paso === 1 && (
          <div className="form">
            <TextField label="Calle" fullWidth margin="normal" value={direccion.calle} onChange={e => setDireccion({ ...direccion, calle: e.target.value })} />
            <TextField label="Número" fullWidth margin="normal" value={direccion.numero} onChange={e => setDireccion({ ...direccion, numero: e.target.value })} />
            <TextField label="Ciudad" fullWidth margin="normal" value={direccion.ciudad} onChange={e => setDireccion({ ...direccion, ciudad: e.target.value })} />
            <TextField label="Provincia" fullWidth margin="normal" value={direccion.provincia} onChange={e => setDireccion({ ...direccion, provincia: e.target.value })} />
            <TextField label="Código Postal" fullWidth margin="normal" value={direccion.codigoPostal} onChange={e => setDireccion({ ...direccion, codigoPostal: e.target.value })} />

            <div className="actions">
              <Button onClick={handleBack}>Volver</Button>
              <Button variant="contained" disabled={!paso2Completo} onClick={handleNext}>Siguiente</Button>
            </div>
          </div>
        )}

        {paso === 2 && (
          <div className="resumen">
            <h3>Confirmación de Pedido</h3>

            <div className="section">
              <h4>Productos</h4>
              {carrito.map((prod, i) => (
                <div key={i} className="line-item">
                  <span>{prod.nombre}</span>
                  <span>{prod.cantidad || 1} x ${prod.precio}</span>
                </div>
              ))}
            </div>

            <div className="section">
              <h4>Datos del Cliente</h4>
              <p>{datos.nombre} {datos.apellido}</p>
              <p>{datos.email}</p>
            </div>

            <div className="section">
              <h4>Dirección de Entrega</h4>
              <p>{direccion.calle} {direccion.numero}</p>
              <p>{direccion.ciudad}, {direccion.provincia}</p>
              <p>CP: {direccion.codigoPostal}</p>
            </div>

            <div className="actions">
              <Button onClick={handleBack}>Volver</Button>
              <Button variant="contained" onClick={handleCrearPedido}>Crear Pedido</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Checkout;
