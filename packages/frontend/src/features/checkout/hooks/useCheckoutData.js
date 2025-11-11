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
  const [pedidoCreado, setPedidoCreado] = useState(null);

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefonoRegex = /^\d{8,15}$/;

  const paso1Completo = datos.nombre &&
                        datos.nombre.length >= 2 &&
                        datos.apellido &&
                        datos.apellido.length >= 2 &&
                        datos.email &&
                        emailRegex.test(datos.email) &&
                        datos.telefono &&
                        telefonoRegex.test(datos.telefono);

  const paso2Completo = direccion.calle &&
                        direccion.numero &&
                        !isNaN(Number(direccion.numero)) &&
                        Number(direccion.numero) > 0 &&
                        direccion.ciudad &&
                        direccion.codigoPostal &&
                        !isNaN(Number(direccion.codigoPostal)) &&
                        Number(direccion.codigoPostal) > 0;

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
      console.log('Producto:', producto, 'ID extraído:', producto.id);
      return {
        productoId: producto.id,
        cantidad: producto.cantidad || 1
      };
    });
  };

  const prepararDireccionEntrega = () => {
    console.log('Dirección antes de preparar:', direccion);

    const direccionPreparada = {
      calle: direccion.calle,
      numero: parseInt(direccion.numero) || 1,
      codigoPostal: parseInt(direccion.codigoPostal) || 1000,
      ciudad: direccion.ciudad
    };
    console.log('Dirección preparada:', direccionPreparada);
    return direccionPreparada;
  };

  const obtenerUsuarioId = () => {
    return "690ec5610179aefbee3e53b1"; // ObjectId válido hardcodeado
  };

  const construirPedidoData = (usuarioId) => {
    return {
      usuarioId: usuarioId,
      items: prepararItemsPedido(),
      moneda: 'PESO_ARG',
      direccionEntrega: prepararDireccionEntrega()
    };
  };

  // Crear pedido
  const handleCrearPedido = async () => {
    try {
      const usuarioId = obtenerUsuarioId();
      const pedidoData = construirPedidoData(usuarioId);

      console.log('Enviando pedido:', pedidoData);

      const pedidoCreado = await postPedido(pedidoData);

      setPedidoId(pedidoCreado.id);
      setPedidoCreado(pedidoCreado);
      setPedidoConfirmado(true);
      limpiarCarrito();

      navigate('/checkout/exito');

      return pedidoCreado;
    } catch (error) {
      console.error('Error al crear pedido:', error);

      const respuesta = error.response?.data;
      const mensajeBackend =
        typeof respuesta === 'string'
          ? respuesta
          : respuesta?.message || respuesta?.error;

      const mensajeError =
        mensajeBackend ||
        (error.message.includes('400')
          ? 'Datos del pedido inválidos. Verifique la información ingresada.'
          : error.message.includes('401')
          ? 'No tiene autorización para realizar esta operación.'
          : error.message.includes('500')
          ? 'Error interno del servidor. Intente más tarde.'
          : 'Error al procesar el pedido. Por favor intente nuevamente.');

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
    pedidoCreado,

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
    handleCrearPedido
  };
};
