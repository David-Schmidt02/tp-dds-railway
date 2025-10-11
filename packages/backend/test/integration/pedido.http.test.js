import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import { configureRoutes } from '../../src/app/routes.js';
import { PedidoController } from '../../src/controllers/pedidoController';

describe('🧾 Feature: Creación de Pedido (POST /pedidos)', () => {
  let app;
  let mockPedidoService;

  const makePedidoBody = () => ({
    usuarioId: '652f91b92b1d3a001f0c8a12',
    items: [
      { productoId: '652f91b92b1d3a001f0c8a99', cantidad: 2, precioUnitario: 150 }
    ],
    direccionEntrega: {
      calle: 'Av. Siempre Viva',
      numero: '742',
      ciudad: 'Springfield',
      codigoPostal: '1234',
      provincia: 'Buenos Aires',
      referencia: 'Casa amarilla'
    },
    total: 300,
    estado: 'PENDIENTE'
  });

  beforeAll(() => {
    mockPedidoService = {
      crearPedido: jest.fn(),
      obtenerPedidos: jest.fn(),
      obtenerPedidosPorUsuario: jest.fn(),
      cancelarPedido: jest.fn(),
      cambiarCantidadItem: jest.fn()
    };

    const pedidoController = new PedidoController(mockPedidoService);

    const productoController = {
      obtenerProductos: (req, res, next) => next(),
      obtenerProductosOrdenados: (req, res, next) => next(),
      listarProductosVendedorConFiltros: (req, res, next) => next()
    };
    const notificacionController = {
      obtenerNotificacionesDeUnUsuario: (req, res, next) => next(),
      marcarNotificacionComoLeida: (req, res, next) => next()
    };
    const usuarioController = {
      crearUsuario: (req, res, next) => next()
    };

    app = express();
    app.use(express.json());
    configureRoutes(app, {
      pedidoController,
      productoController,
      notificacionController,
      usuarioController
    });
  });

  describe('Scenario: Crear un pedido válido', () => {
    test('debería devolver 201 y el pedido creado', async () => {
      const body = makePedidoBody();
      const fakePedido = { id: 'ped001', ...body };

      mockPedidoService.crearPedido.mockResolvedValue(fakePedido);

      const res = await request(app)
        .post('/pedidos')
        .send(body)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('id', 'ped001');
      expect(mockPedidoService.crearPedido).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('Scenario: Datos inválidos', () => {
    test('debería devolver 400 si falta usuarioId', async () => {
      const { usuarioId, ...invalidBody } = makePedidoBody();

      const res = await request(app).post('/pedidos').send(invalidBody).expect(400);

      expect(res.body).toHaveProperty('message', 'Datos de entrada inválidos');
    });
  });

  describe('Scenario: Error del servicio', () => {
    test('debería devolver 500 si el servicio lanza error', async () => {
      const body = makePedidoBody();

      mockPedidoService.crearPedido.mockRejectedValue(new Error('Error DB'));

      const res = await request(app).post('/pedidos').send(body).expect(500);
      expect(res.body).toHaveProperty('message');
    });
  });
});