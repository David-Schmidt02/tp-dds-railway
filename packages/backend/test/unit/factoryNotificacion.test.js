/*
import { factoryNotificacionPedidos } from './factoryNotificacionPedidos.js';
import { Notificacion } from './notificacion.js';

// Mock de la clase Notificacion para interceptar las instancias creadas
jest.mock('./notificacion.js', () => ({
  Notificacion: jest.fn().mockImplementation((data, mensaje) => ({
    ...data,
    mensaje,
  })),
}));

describe('factoryNotificacionPedidos', () => {
  let pedidoMock;

  beforeEach(() => {
    jest.clearAllMocks();

    pedidoMock = {
      id: 'pedido-123',
      comprador: { id: 'comp-1', nombre: 'Juan' },
      vendedor: { id: 'vend-1', nombre: 'Tienda XYZ' },
      direccionEntrega: { calle: 'Av. Siempre Viva', altura: 742, ciudad: 'Springfield' },
      estado: { nombre: 'CONFIRMADO' },
      itemsPedido: [
        {
          producto: { titulo: 'Producto A', vendedor: { id: 'vend-1' } },
          subtotal: jest.fn().mockReturnValue(100),
        },
        {
          producto: { titulo: 'Producto B', vendedor: { id: 'vend-1' } },
          subtotal: jest.fn().mockReturnValue(50),
        },
      ],
      calcularTotal: jest.fn().mockReturnValue(150),
    };
  });

  // ---- crearPedido ----
  test('crearPedido genera una notificación con los datos del pedido', () => {
    const result = factoryNotificacionPedidos.crearPedido(pedidoMock);

    expect(pedidoMock.calcularTotal).toHaveBeenCalled();
    expect(Notificacion).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('vend-1');
    expect(result.mensaje).toContain('Nuevo pedido recibido');
    expect(result.mensaje).toContain('Juan');
    expect(result.mensaje).toContain('Producto A');
    expect(result.mensaje).toContain('Producto B');
  });

  // ---- cancelarPedido ----
  test('cancelarPedido genera una notificación con el id y total', () => {
    const result = factoryNotificacionPedidos.cancelarPedido(pedidoMock);

    expect(Notificacion).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('vend-1');
    expect(result.mensaje).toContain('Pedido cancelado');
    expect(result.mensaje).toContain('pedido-123');
    expect(result.mensaje).toContain('Total: 150');
  });

  // ---- confirmarPedido ----
  test('confirmarPedido genera una notificación para el comprador', () => {
    const result = factoryNotificacionPedidos.confirmarPedido(pedidoMock);

    expect(Notificacion).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('comp-1');
    expect(result.mensaje).toContain('Tu pedido fue confirmado');
    expect(result.mensaje).toContain('CONFIRMADO');
  });

  // ---- formatearMensajeNotificacion ----
  test('el mensaje generado por formatearMensajeNotificacion contiene los campos esperados', () => {
    const result = factoryNotificacionPedidos.crearPedido(pedidoMock);
    const mensaje = result.mensaje;

    expect(mensaje).toContain('Dirección: Av. Siempre Viva');
    expect(mensaje).toContain('Ciudad: Springfield');
  });
});
*/