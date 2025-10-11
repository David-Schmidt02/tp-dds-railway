import request from 'supertest';
import { jest } from '@jest/globals';
import express from 'express';
import { configureRoutes } from '../../src/app/routes';  
import { ProductoController } from '../../src/controllers/productoController'; 

describe('Feature: Búsqueda de Productos (GET /productos)', () => {
  let app;
  let mockProductoService;

  beforeAll(() => {
    mockProductoService = {
      obtenerProductos: jest.fn(),
      obtenerProductosOrdenados: jest.fn(),
      listarProductosVendedorConFiltros: jest.fn()
    };

    const productoController = new ProductoController(mockProductoService);

    const pedidoController = {
      obtenerPedidos: (req, res, next) => next(),
      crearPedido: (req, res, next) => next(),
      consultarHistorialPedido: (req, res, next) => next(),
      cancelarPedido: (req, res, next) => next(),
      cambiarCantidadItem: (req, res, next) => next()
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

  describe('Scenario: Obtener productos correctamente', () => {
    test('debería devolver 200 y lista de productos', async () => {
      const productosMock = [
        {
          _id: 'p001',
          titulo: 'Camiseta Azul',
          descripcion: 'Camiseta 100% algodón',
          precio: 100,
          moneda: 'PESO_ARG',
          stock: 10,
          vendidos: 2,
          categorias: ['Ropa'],
          fotos: [],
          activo: true,
          vendedor: { id: 'v001', nombre: 'Juan Pérez', email: 'juan@shop.com' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      mockProductoService.obtenerProductos.mockResolvedValue(productosMock);

      const res = await request(app)
        .get('/productos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('id', 'p001');
      expect(res.body[0]).toHaveProperty('titulo', 'Camiseta Azul');
      expect(res.body[0]).toHaveProperty('precio', 100);
      expect(res.body[0]).toHaveProperty('moneda', 'PESO_ARG');
      expect(res.body[0]).toHaveProperty('vendedor');
    });
  });

  describe('Scenario: Error en el servicio', () => {
    test('debería devolver 500 si el servicio falla', async () => {
      mockProductoService.obtenerProductos.mockRejectedValue(new Error('Falla DB'));
      const res = await request(app).get('/productos').expect(500);
      expect(res.body).toHaveProperty('message');
    });
  });
});