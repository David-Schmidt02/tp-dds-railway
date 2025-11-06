import React, { useState } from 'react';
import { Card, Button, TextField, Stepper, Step, StepLabel, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './checkout.css';

const pasos = ['Usuario', 'Direccion', 'Pago'];

const Checkout = ({ carrito, limpiarCarrito }) => {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(0);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });

  const [direccion, setDireccion] = useState({
    calle: '',
    numero: '',
    departamento: '',
    codigoPostal: '',
    ciudad: '',
    provincia: '',
    referencias: ''
  });

  const [metodoPago, setMetodoPago] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const [datosTarjeta, setDatosTarjeta] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaVencimiento: '',
    codigoSeguridad: '',
    tipoTarjeta: 'credito'
  });

  const handleNext = () => setPaso(prev => prev + 1);
  const handleBack = () => setPaso(prev => prev - 1);

  const calcularTotal = () => {
    if (!carrito || carrito.length === 0) return 0;
    return carrito.reduce((total, producto) => {
      const precio = producto.precio || 0;
      const cantidad = producto.cantidad || 1;
      return total + (precio * cantidad);
    }, 0);
  };

  const calcularSubtotal = () => calcularTotal();
  const calcularEnvio = () => 0;
  const calcularImpuestos = () => 0;

  // Función para preparar los datos del comprador
  const prepararDatosComprador = () => {
    return {
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,
      telefono: datos.telefono,
    };
  };

  // Función para preparar los items del pedido (según schema backend)
  const prepararItemsPedido = () => {
    return carrito.map(producto => ({
      productoId: producto.id,
      cantidad: producto.cantidad || 1
      // Backend no espera precioUnitario aquí
    }));
  };

  // Función para procesar la dirección de entrega (según schema backend)
  const prepararDireccionEntrega = () => {
    const [piso, depto] = direccion.departamento 
      ? direccion.departamento.split('/').map(s => s.trim())
      : [undefined, undefined];

    return {
      calle: direccion.calle,
      numero: parseInt(direccion.numero),
      piso: piso ? parseInt(piso) : undefined,
      departamento: depto ? parseInt(depto) : undefined, // Backend espera number
      codigoPostal: parseInt(direccion.codigoPostal), // Backend espera number
      ciudad: direccion.ciudad
      // Backend no espera provincia ni referencias
    };
  };

  // Función para obtener/crear usuarioId
  // NOTA: Esta función necesita ser implementada según tu sistema de autenticación
  const obtenerUsuarioId = () => {
    // Por ahora retornamos un ID simulado
    // En una implementación real, esto vendría del contexto de autenticación
    // o se crearía un usuario temporal
    return "usuario_temp_" + Date.now();
  };

  // Función para construir el objeto completo del pedido (según schema backend)
  const construirPedidoData = () => {
    return {
      usuarioId: obtenerUsuarioId(), // Backend espera usuarioId como string
      items: prepararItemsPedido(),
      moneda: 'PESO_ARG',
      direccionEntrega: prepararDireccionEntrega()
      // Backend no espera: comprador, metodoPago, total
    };
  };

  // Función para guardar datos adicionales del usuario (para uso futuro)
  const guardarDatosUsuarioAdicionales = () => {
    const datosAdicionales = {
      datosPersonales: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        telefono: datos.telefono,
        dni: datos.dni
      },
      metodoPago: {
        tipo: metodoPago,
        ...(metodoPago === 'tarjeta' && {
          datosAdicionales: {
            tipoTarjeta: datosTarjeta.tipoTarjeta,
            numeroTarjeta: datosTarjeta.numeroTarjeta.replace(/\s/g, ''),
            nombreTitular: datosTarjeta.nombreTitular,
            fechaVencimiento: datosTarjeta.fechaVencimiento
          }
        })
      },
      direccionCompleta: {
        ...direccion
      }
    };
    
    // Aquí podrías enviar estos datos a otro endpoint o localStorage
    localStorage.setItem('datosCheckout', JSON.stringify(datosAdicionales));
    return datosAdicionales;
  };

  // Función para enviar el pedido al backend
  const enviarPedidoAlBackend = 

  // Función para manejar el éxito del pedido
  const manejarExitoPedido = (pedidoCreado) => {
    setPedidoId(pedidoCreado.id);
    setPedidoConfirmado(true);
    limpiarCarrito();
  };

  // Función para manejar errores
  const manejarErrorPedido = (error) => {
    console.error('Error al crear pedido:', error);
    
    // Determinar el mensaje de error específico
    let mensajeError = 'Error al procesar el pedido. Por favor intente nuevamente.';
    
    if (error.message.includes('400')) {
      mensajeError = 'Datos del pedido inválidos. Verifique la información ingresada.';
    } else if (error.message.includes('401')) {
      mensajeError = 'No tiene autorización para realizar esta operación.';
    } else if (error.message.includes('500')) {
      mensajeError = 'Error interno del servidor. Intente más tarde.';
    }
    
    alert(mensajeError);
  };

  // Función principal para crear el pedido
  const handleCrearPedido = async () => {
    try {
      // Paso 1: Guardar datos adicionales del usuario
      const datosAdicionales = guardarDatosUsuarioAdicionales();
      
      // Paso 2: Construir los datos del pedido según schema backend
      const pedidoData = construirPedidoData();
      
      // Paso 3: Enviar al backend
      const pedidoCreado = await enviarPedidoAlBackend(pedidoData);
      
      // Paso 4: Manejar el éxito
      manejarExitoPedido(pedidoCreado);
      
    } catch (error) {
      // Paso 5: Manejar errores
      manejarErrorPedido(error);
    }
  };

  const handleVolverAHome = () => {
    navigate('/');
  };

  const paso1Completo = datos.nombre && datos.apellido && datos.email && datos.telefono;
  const paso2Completo = direccion.calle && direccion.numero && direccion.ciudad && direccion.provincia && direccion.codigoPostal;
  const tarjetaCompleta = metodoPago !== 'tarjeta' || (
    datosTarjeta.numeroTarjeta && 
    datosTarjeta.nombreTitular && 
    datosTarjeta.fechaVencimiento && 
    datosTarjeta.codigoSeguridad
  );
  
  const paso3Completo = metodoPago && aceptaTerminos && tarjetaCompleta;

  if (pedidoConfirmado) {
    return (
      <div className="checkout-root">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1>CHECKOUT</h1>
            <div className="step-indicators">
              <span className="step completed">Usuario</span>
              <span className="divider"></span>
              <span className="step completed">Direccion</span>
              <span className="divider"></span>
              <span className="step completed">Pago</span>
            </div>
          </div>
          
          <div className="confirmation-success">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h2>Pedido confirmado</h2>
              <p>Total <strong>${calcularTotal().toFixed(2)}</strong></p>
              
              <div className="order-details">
                <p><strong>15/5/2025, 1:42:23 PM</strong></p>
                <p>Sin dirección registrada</p>
              </div>
              
              <div className="success-actions">
                <Button variant="contained" className="success-button">Ver comprobante</Button>
                <Button variant="text" className="email-button">Reenviar email</Button>
              </div>
              
              <p className="success-note">Se almacenó la confirmación de compra asociada a tu cuenta.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-root">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>CHECKOUT</h1>
          <div className="step-indicators">
            <span className={`step ${paso >= 0 ? 'active' : ''}`}>Usuario</span>
            <span className="divider"></span>
            <span className={`step ${paso >= 1 ? 'active' : ''}`}>Direccion</span>
            <span className="divider"></span>
            <span className={`step ${paso >= 2 ? 'active' : ''}`}>Pago</span>
          </div>
        </div>

        <div className="checkout-content">
          {paso === 0 && (
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
          )}

          {paso === 1 && (
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
          )}

          {paso === 2 && (
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
                            // Formatear número de tarjeta con espacios cada 4 dígitos
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
                              // Formatear MM/YY
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
          )}

          {paso === 3 && (
            <div className="summary-section">
              <div className="summary-content">
                <div className="summary-left">
                  <h2>REVISIÓN Y CONFIRMACIÓN</h2>
                  
                  <div className="summary-block">
                    <h3>DIRECCIÓN DE ENTREGA</h3>
                    <p>{direccion.calle} {direccion.numero}</p>
                    <p>{direccion.ciudad}, {direccion.provincia} {direccion.codigoPostal}</p>
                    {direccion.departamento && <p>Depto: {direccion.departamento}</p>}
                    {direccion.referencias && <p>Ref: {direccion.referencias}</p>}
                  </div>

                  <div className="summary-block">
                    <h3>MÉTODO DE PAGO</h3>
                    {metodoPago === 'tarjeta' ? (
                      <>
                        <p>Tarjeta de {datosTarjeta.tipoTarjeta === 'credito' ? 'crédito' : 'débito'}</p>
                        <p>**** **** **** {datosTarjeta.numeroTarjeta.slice(-4)}</p>
                        <p>{datosTarjeta.nombreTitular}</p>
                        <p>Vence: {datosTarjeta.fechaVencimiento}</p>
                      </>
                    ) : (
                      <p>{metodoPago === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo / Pago en ventanilla'}</p>
                    )}
                    <p>Acepta términos y condiciones</p>
                  </div>

                  <div className="form-actions">
                    <Button variant="outlined" onClick={handleBack} className="back-button">
                      ATRÁS
                    </Button>
                    <Button variant="contained" onClick={handleCrearPedido} className="confirm-button">
                      ACEPTAR
                    </Button>
                  </div>
                </div>

                <div className="summary-right">
                  <div className="price-summary">
                    <h3>PAGO TOTAL</h3>
                    <div className="price-line">
                      <span>Subtotal</span>
                      <span>${calcularSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="price-line">
                      <span>Envío/ID:</span>
                      <span>${calcularEnvio().toFixed(2)}</span>
                    </div>
                    <div className="price-line">
                      <span>Impuestos/ID:</span>
                      <span>${calcularImpuestos().toFixed(2)}</span>
                    </div>
                    <div className="price-total">
                      <span><strong>Total</strong></span>
                      <span><strong>${calcularTotal().toFixed(2)}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
