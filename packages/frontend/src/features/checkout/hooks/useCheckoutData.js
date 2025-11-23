import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postPedido } from '../../../services/api';

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
  const [pedidoCreado, setPedidoCreado] = useState(null);
  const [pedidoError, setPedidoError] = useState(null);
  const [procesandoPedido, setProcesandoPedido] = useState(false);

  // Funciones de cálculo
  const COSTO_ENVIO = 500;
  const TASA_IMPUESTOS = 0.21;

  const calcularSubtotal = () => {
    if (!carrito || carrito.length === 0) return 0;
    return carrito.reduce((total, producto) => {
      const precio = producto.precio || 0;
      const cantidad = producto.cantidad || 1;
      return total + (precio * cantidad);
    }, 0);
  };

  const calcularEnvio = () => COSTO_ENVIO;

  const calcularImpuestos = () => {
    const subtotal = calcularSubtotal();
    return subtotal * TASA_IMPUESTOS;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularEnvio() + calcularImpuestos();
  };

  // Validaciones reutilizables
  const validaciones = {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefonoRegex: /^\d{8,15}$/,

    esEmailValido: (email) => {
      if (!email) return false;
      return validaciones.emailRegex.test(email);
    },

    esTelefonoValido: (telefono) => {
      if (!telefono) return false;
      return validaciones.telefonoRegex.test(telefono);
    },

    esTextoValido: (texto, minLength = 2) => {
      if (!texto) return false;
      return texto.length >= minLength;
    },

    esNumeroValido: (valor) => {
      if (!valor) return false;
      const num = Number(valor);
      return !isNaN(num) && num > 0;
    }
  };

  const paso1Completo =
    validaciones.esTextoValido(datos.nombre, 2) &&
    validaciones.esTextoValido(datos.apellido, 2) &&
    validaciones.esEmailValido(datos.email) &&
    validaciones.esTelefonoValido(datos.telefono);

  const paso2Completo =
    direccion.calle &&
    validaciones.esNumeroValido(direccion.numero) &&
    direccion.ciudad &&
    validaciones.esNumeroValido(direccion.codigoPostal);

  const tarjetaCompleta = metodoPago !== 'tarjeta' || (
    datosTarjeta.numeroTarjeta &&
    datosTarjeta.nombreTitular &&
    datosTarjeta.fechaVencimiento &&
    datosTarjeta.codigoSeguridad
  );

  const paso3Completo = metodoPago && aceptaTerminos && tarjetaCompleta;

  // Preparar datos para backend
  const prepararItemsPedido = () => {
    return carrito.map(producto => ({
      productoId: producto.id,
      cantidad: producto.cantidad || 1
    }));
  };

  const prepararDireccionEntrega = () => {
    return {
      calle: direccion.calle,
      numero: parseInt(direccion.numero) || 1,
      codigoPostal: parseInt(direccion.codigoPostal) || 1000,
      ciudad: direccion.ciudad
    };
  };

  const obtenerUsuarioId = () => {
    return "6560f1a1e4b0a1b2c3d4e5f3"; // ObjectId válido hardcodeado
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
    setProcesandoPedido(true);
    try {
      const usuarioId = obtenerUsuarioId();
      const pedidoData = construirPedidoData(usuarioId);

      const pedidoCreado = await postPedido(pedidoData);

      setPedidoError(null);
      setPedidoCreado(pedidoCreado);
      setPedidoConfirmado(true);
      limpiarCarrito();

      navigate('/checkout/exito');

      return pedidoCreado;
    } catch (error) {
      const respuesta = error.response?.data;
      const mensajeBackend =
        typeof respuesta === 'string'
          ? respuesta
          : respuesta?.message || respuesta?.error;

      const mensajeError = mensajeBackend || 'Error no especificado del backend';

      setPedidoError({
        message: mensajeError,
        detail: respuesta,
      });

      navigate('/checkout/error');
      return null;
    } finally {
      setProcesandoPedido(false);
    }
  };

  const clearPedidoError = () => setPedidoError(null);

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
    pedidoCreado,
    pedidoError,
    procesandoPedido,

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
    clearPedidoError,

    // Validaciones reutilizables
    validaciones
  };
};
