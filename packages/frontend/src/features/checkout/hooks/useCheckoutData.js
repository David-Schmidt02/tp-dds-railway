import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postPedido } from '../../../services/productoService';

export const useCheckoutData = (carrito, limpiarCarrito) => {
  const navigate = useNavigate();

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

  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  // Funciones de cálculo
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

  // Validaciones por paso
  const paso1Completo = datos.nombre && datos.apellido && datos.email && datos.telefono;

  const paso2Completo = direccion.calle && direccion.numero && direccion.ciudad &&
                        direccion.provincia && direccion.codigoPostal;

  const tarjetaCompleta = metodoPago !== 'tarjeta' || (
    datosTarjeta.numeroTarjeta &&
    datosTarjeta.nombreTitular &&
    datosTarjeta.fechaVencimiento &&
    datosTarjeta.codigoSeguridad
  );

  const paso3Completo = metodoPago && aceptaTerminos && tarjetaCompleta;

  // Preparar datos para backend
  const prepararItemsPedido = () => {
    console.log('Carrito en prepararItemsPedido:', carrito);
    return carrito.map(producto => {
      const id = producto.id || producto._id;
      console.log('Producto:', producto, 'ID extraído:', id);
      return {
        productoId: id,
        cantidad: producto.cantidad || 1
      };
    });
  };

  const prepararDireccionEntrega = () => {
    console.log('Dirección antes de preparar:', direccion);
    const [piso, depto] = direccion.departamento
      ? direccion.departamento.split('/').map(s => s.trim())
      : [undefined, undefined];

    const direccionPreparada = {
      calle: direccion.calle,
      numero: parseInt(direccion.numero) || 1,
      piso: piso ? parseInt(piso) : undefined,
      departamento: depto ? parseInt(depto) : undefined,
      codigoPostal: parseInt(direccion.codigoPostal) || 1000,
      ciudad: direccion.ciudad
    };
    console.log('Dirección preparada:', direccionPreparada);
    return direccionPreparada;
  };

  const obtenerUsuarioId = () => {
    return "507f1f77bcf86cd799439011"; // ObjectId válido hardcodeado
  };

  const construirPedidoData = (usuarioId) => {
    return {
      usuarioId: usuarioId,
      items: prepararItemsPedido(),
      moneda: 'PESO_ARG',
      direccionEntrega: prepararDireccionEntrega()
    };
  };

  // Guardar datos adicionales en localStorage
  const guardarDatosUsuarioAdicionales = () => {
    const datosAdicionales = {
      datosPersonales: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.email,
        telefono: datos.telefono
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

    localStorage.setItem('datosCheckout', JSON.stringify(datosAdicionales));
    return datosAdicionales;
  };

  // Crear pedido
  const handleCrearPedido = async () => {
    try {
      const usuarioId = obtenerUsuarioId();
      const pedidoData = construirPedidoData(usuarioId);

      console.log('Enviando pedido:', pedidoData);

      const pedidoCreado = await postPedido(pedidoData);

      setPedidoId(pedidoCreado.id);
      setPedidoConfirmado(true);
      limpiarCarrito();

      navigate('/checkout/exito');

      return pedidoCreado;
    } catch (error) {
      console.error('Error al crear pedido:', error);

      let mensajeError = 'Error al procesar el pedido. Por favor intente nuevamente.';

      if (error.message.includes('400')) {
        mensajeError = 'Datos del pedido inválidos. Verifique la información ingresada.';
      } else if (error.message.includes('401')) {
        mensajeError = 'No tiene autorización para realizar esta operación.';
      } else if (error.message.includes('500')) {
        mensajeError = 'Error interno del servidor. Intente más tarde.';
      }

      alert(mensajeError);
      throw error;
    }
  };

  return {
    // Estados
    datos,
    setDatos,
    direccion,
    setDireccion,
    metodoPago,
    setMetodoPago,
    aceptaTerminos,
    setAceptaTerminos,
    datosTarjeta,
    setDatosTarjeta,
    pedidoConfirmado,
    pedidoId,

    // Validaciones
    paso1Completo,
    paso2Completo,
    paso3Completo,

    // Cálculos
    calcularTotal,
    calcularSubtotal,
    calcularEnvio,
    calcularImpuestos,

    // Funciones
    handleCrearPedido,
    guardarDatosUsuarioAdicionales
  };
};
