/*
import { Pedido } from '../../src/models/entities/pedido.js';

// Mockeamos las dependencias
jest.mock('../models/estadoPedido.js', () => ({
  EstadoPedido: {
    PENDIENTE: { nombre: 'PENDIENTE', puedeTransicionarA: jest.fn() },
  },
}));

jest.mock('../models/cambioEstadoPedido.js', () => ({
  CambioEstadoPedido: jest.fn().mockImplementation((estado, pedido, usuario, motivo) => ({
    estado,
    pedido,
    usuario,
    motivo,
  })),
}));

describe('Clase Pedido', () => {
  let mockItem1;
  let mockItem2;
  let mockComprador;
  let mockDireccion;
  let pedido;

  beforeEach(() => {
    jest.clearAllMocks();

    mockItem1 = {
      subtotal: jest.fn(() => 100),
      producto: { estaDisponible: jest.fn(() => true) },
      getId: jest.fn(() => 'p001'),
      cambiarCantidad: jest.fn(),
      cantidad: 2
    };

    mockItem2 = {
      subtotal: jest.fn(() => 200),
      producto: { estaDisponible: jest.fn(() => false) },
      getId: jest.fn(() => 'p002'),
      cambiarCantidad: jest.fn(),
      cantidad: 1
    };

    mockComprador = { getId: jest.fn(() => 'u001') };
    mockDireccion = {};

    const { EstadoPedido } = jest.requireMock('../models/estadoPedido.js');
    pedido = new Pedido(mockComprador, [mockItem1, mockItem2], 'ARS', mockDireccion);
    pedido.estado = EstadoPedido.PENDIENTE;
  });

  // --------------------
  // TESTS DE CONSTRUCCIÓN
  // --------------------
  test('debería crearse con los valores correctos', () => {
    expect(pedido.comprador).toBe(mockComprador);
    expect(pedido.itemsPedido.length).toBe(2);
    expect(pedido.moneda).toBe('ARS');
    expect(pedido.direccionEntrega).toBe(mockDireccion);
    expect(pedido.estado.nombre).toBe('PENDIENTE');
    expect(pedido.historialEstados).toEqual([]);
    expect(pedido.fechaCreacion).toBeInstanceOf(Date);
  });

  // --------------------
  // calcularTotal
  // --------------------
  test('debería calcular el total correctamente', () => {
    const total = pedido.calcularTotal();
    expect(total).toBe(300);
    expect(mockItem1.subtotal).toHaveBeenCalled();
    expect(mockItem2.subtotal).toHaveBeenCalled();
  });

  // --------------------
  // validarStock
  // --------------------
  test('debería validar el stock correctamente', () => {
    expect(pedido.validarStock()).toBe(false); // mockItem2 devuelve false
    mockItem2.producto.estaDisponible.mockReturnValueOnce(true);
    expect(pedido.validarStock()).toBe(true);
  });

  // --------------------
  // agregar y sacar item
  // --------------------
  test('debería agregar y sacar items', () => {
    const nuevoItem = { subtotal: jest.fn(() => 50), producto: {}, cantidad: 1 };
    pedido.agregarItem(nuevoItem);
    expect(pedido.itemsPedido.includes(nuevoItem)).toBe(true);

    pedido.sacarItem();
    expect(pedido.itemsPedido.includes(nuevoItem)).toBe(false);
  });

  // --------------------
  // obtenerCantidadItem
  // --------------------
  test('debería obtener la cantidad de un item existente', () => {
    expect(pedido.obtenerCantidadItem('p001')).toBe(2);
  });

  test('debería devolver null si el producto no está en el pedido', () => {
    expect(pedido.obtenerCantidadItem('xyz')).toBeNull();
  });

  // --------------------
  // puedeModificarItems / puedeCancelarse
  // --------------------
  test('debería permitir modificar items cuando el estado no es final', () => {
    pedido.estado = { nombre: 'PENDIENTE' };
    expect(pedido.puedeModificarItems()).toBe(true);
  });

  test('no debería permitir modificar si el pedido está enviado', () => {
    pedido.estado = { nombre: 'ENVIADO' };
    expect(pedido.puedeModificarItems()).toBe(false);
  });

  test('debería poder cancelarse si no está enviado ni entregado ni cancelado', () => {
    pedido.estado = 'PENDIENTE';
    expect(pedido.puedeCancelarse()).toBe(true);
  });

  test('no debería poder cancelarse si ya fue enviado', () => {
    pedido.estado = 'ENVIADO';
    expect(pedido.puedeCancelarse()).toBe(false);
  });

  // --------------------
  // modificarCantidadItem
  // --------------------
  test('debería modificar la cantidad de un item existente', () => {
    pedido.estado = { nombre: 'PENDIENTE' };
    pedido.modificarCantidadItem('p001', 5);
    expect(mockItem1.cambiarCantidad).toHaveBeenCalledWith(5);
  });

  test('debería lanzar error si el producto no existe en el pedido', () => {
    expect(() => pedido.modificarCantidadItem('zzz', 5)).toThrow('Producto no encontrado en el pedido');
  });

  test('debería lanzar PedidoNoModificable si el estado no permite cambios', async () => {
    pedido.puedeModificarItems = jest.fn(() => false);
    const { PedidoNoModificable } = await import('../../excepciones/pedido.js');
    expect(() => pedido.modificarCantidadItem('p001', 2)).toThrow();
  });

  // --------------------
  // perteneceAUsuario
  // --------------------
  test('debería verificar si el pedido pertenece al usuario', () => {
    expect(pedido.perteneceAUsuario('u001')).toBe(true);
    expect(pedido.perteneceAUsuario('otro')).toBe(false);
  });
});
*/