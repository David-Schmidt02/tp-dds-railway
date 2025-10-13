import { Pedido } from '../../src/models/entities/pedido';
import { PedidoNoModificable } from '../../src/excepciones/pedido';
import { jest } from '@jest/globals';

// Creamos mocks de las dependencias
const mockItem1 = {
  getId: jest.fn().mockReturnValue('prod1'),
  subtotal: jest.fn().mockReturnValue(100),
  cantidad: 2,
  cambiarCantidad: jest.fn(),
  producto: {
    id: 'prod1',
    estaDisponible: jest.fn().mockReturnValue(true)
  }
};

const mockItem2 = {
  getId: jest.fn().mockReturnValue('prod2'),
  subtotal: jest.fn().mockReturnValue(200),
  cantidad: 1,
  cambiarCantidad: jest.fn(),
  producto: {
    id: 'prod2',
    estaDisponible: jest.fn().mockReturnValue(false)
  }
};

const mockItem3 = {
  getId: jest.fn().mockReturnValue('prod3'),
  subtotal: jest.fn().mockReturnValue(300),
  cantidad: 2,
  cambiarCantidad: jest.fn(),
  producto: {
    id: 'prod3',
    estaDisponible: jest.fn().mockReturnValue(true)
  }
};

const mockUsuario = {
  getId: jest.fn().mockReturnValue('user1')
};

const mockDireccion = {
  calle: 'Av. Siempre Viva',
  altura: 742,
  ciudad: 'Springfield'
};

const mockEstadoPendiente = { nombre: 'PENDIENTE', puedeTransicionarA: jest.fn().mockReturnValue(true) };
const mockNuevoEstado = { nombre: 'EN_PROCESO' };

describe('Clase Pedido', () => {
  let pedido;

  beforeEach(() => {
    pedido = new Pedido(mockUsuario, [mockItem1], 'ARS', mockDireccion);
    pedido.estado = mockEstadoPendiente; // Sobrescribimos el estado por mock
  });

  test('Calcular el total', () => {
    expect(pedido.calcularTotal()).toBe(100);
  });

  test('Agregar un item y calcular el total con 2 items distintos', () => {
    const nuevoItem = mockItem3;
    pedido.agregarItem(nuevoItem);
    expect(pedido.calcularTotal()).toBe(400);
  });

  test('Validar que todos los productos tengan stock', () => {
    expect(pedido.validarStock()).toBe(true);
    pedido.itemsPedido = [mockItem2]; // uno sin stock
    expect(pedido.validarStock()).toBe(false);
  });

  test('Agregar y sacar items correctamente', () => {
    const nuevoItem = { ...mockItem2 };
    pedido.agregarItem(nuevoItem);
    expect(pedido.itemsPedido).toContain(nuevoItem);

    pedido.sacarItem(nuevoItem);
    expect(pedido.itemsPedido).not.toContain(nuevoItem);
  });

  test('Obtener la cantidad del item por ID', () => {
    expect(pedido.obtenerCantidadItem('prod1')).toBe(2);
    expect(pedido.obtenerCantidadItem('inexistente')).toBeNull();
  });

  test('debe permitir modificar items si el estado lo permite', () => {
    pedido.modificarCantidadItem('prod1', 5);
    expect(mockItem1.cambiarCantidad).toHaveBeenCalledWith(5);
  });

  test('debe lanzar error si intenta modificar con estado no modificable', () => {
    pedido.estado = { nombre: 'ENVIADO' };
    expect(() => pedido.modificarCantidadItem('prod1', 3)).toThrow(PedidoNoModificable);
  });

  test('debe lanzar error si el producto no existe al modificar cantidad', () => {
    expect(() => pedido.modificarCantidadItem('inexistente', 3)).toThrow('Producto no encontrado en el pedido');
  });

  test('debe actualizar el estado correctamente cuando puede transicionar', () => {
    pedido.actualizarEstado(mockNuevoEstado, mockUsuario, 'Motivo de prueba');
    expect(pedido.estado).toBe(mockNuevoEstado);
    expect(pedido.historialEstados.length).toBeGreaterThan(0);
  });

  test('debe devolver true si pertenece al usuario correcto', () => {
    expect(pedido.perteneceAUsuario('user1')).toBe(true);
    expect(pedido.perteneceAUsuario('otroUser')).toBe(false);
  });

  test('puedeCancelarse devuelve correctamente según estado', () => {
    pedido.estado.nombre = 'PENDIENTE';
    expect(pedido.puedeCancelarse()).toBe(true);
    pedido.estado.nombre = 'ENVIADO';
    expect(pedido.puedeCancelarse()).toBe(false);
  });

  test('puedeModificarItems devuelve true si el estado lo permite', () => {
    pedido.estado = { nombre: 'PENDIENTE' };
    expect(pedido.puedeModificarItems()).toBe(true);
  });

  test('puedeModificarItems devuelve false si el estado no lo permite', () => {
    pedido.estado = { nombre: 'ENVIADO' };
    expect(pedido.puedeModificarItems()).toBe(false);
  });
});
