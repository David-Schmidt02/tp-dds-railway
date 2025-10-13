import { jest } from '@jest/globals';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(120000);

let __mongo;

beforeAll(async () => {
  __mongo = await MongoMemoryServer.create({
    binary: { version: '7.0.14' },   // estable en Windows
    instance: { dbName: 'testdb' }
  });
  const uri = __mongo.getUri();

  await mongoose.connect(uri, { dbName: 'testdb' });
  await mongoose.connection.db.admin().ping(); // asegura que está operativa
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map(c => c.deleteMany({})));
});

afterAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.connection.close().catch(() => {});
  }
  if (__mongo) {
    await __mongo.stop().catch(() => {});
  }
});


import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';

import { configureRoutes } from '../../src/app/routes.js';
import { buildAppContext } from '../../src/app/context.js';

import { UsuarioModel } from '../../src/schema/usuarioSchema.js';
import { ProductoModel } from '../../src/schema/productoSchema.js';

describe('BDD: Búsqueda de productos de un vendedor (GET /productos/vendedor)', () => {
  let app;
  let vendedor;

  beforeEach(async () => {
    app = express();
    app.use(bodyParser.json());
    configureRoutes(app, buildAppContext());

    vendedor = await UsuarioModel.create({
      nombre: 'Vendedor Uno',
      email: 'vendedor@tienda.com',
      telefono: '11111111',
      tipoUsuario: 'VENDEDOR',
    });

    await ProductoModel.create({
      vendedor: vendedor._id,
      titulo: 'Mouse Gamer',
      descripcion: 'RGB 7200dpi',
      categorias: ['perifericos', 'gaming'],
      precio: 10000,
      moneda: 'ARS',
      stock: 10,
      fotos: [{ url: 'http://img/p1.png' }],
      activo: true,
      vendidos: 25
    });

    await ProductoModel.create({
      vendedor: vendedor._id,
      titulo: 'Teclado Mecánico',
      descripcion: 'Switch blue',
      categorias: ['perifericos'],
      precio: 15000,
      moneda: 'ARS',
      stock: 5,
      fotos: [{ url: 'http://img/p2.png' }],
      activo: true,
      vendidos: 5
    });
  });

  describe('Happy path', () => {
    it('Given vendedorId, When pagino y ordeno por precioAsc, Then 200 con items ordenados', async () => {
      const res = await request(app)
        .get('/productos/vendedor')
        .query({
          vendedorId: vendedor._id.toString(),
          page: 1,
          limit: 2,
          orden: 'precioAsc'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('limit', 2);
      expect(Array.isArray(res.body.items)).toBe(true);

      const precios = res.body.items.map(i => i.precio);
      const sorted = [...precios].sort((a, b) => a - b);
      expect(precios).toEqual(sorted);
    });

    it('Given filtros (min, max, nombre), When consulto, Then 200 con resultados filtrados', async () => {
      const res = await request(app)
        .get('/productos/vendedor')
        .query({
          vendedorId: vendedor._id.toString(),
          min: 9000,
          max: 12000,
          nombre: 'mouse',
          page: 1,
          limit: 10
        });

      expect(res.status).toBe(200);
      expect(res.body.items.some(p => /mouse/i.test(p.titulo))).toBe(true);
      expect(res.body.items.every(p => p.precio >= 9000 && p.precio <= 12000)).toBe(true);
    });
  });

  describe('Errores / bordes', () => {
    it('Given falta vendedorId, When GET /productos/vendedor, Then 400', async () => {
      const res = await request(app).get('/productos/vendedor').query({ page: 1, limit: 10 });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Debe indicar el vendedor');
    });

    it('Given filtros sin match, When GET /productos/vendedor, Then 200 con items vacíos', async () => {
      const res = await request(app)
        .get('/productos/vendedor')
        .query({
          vendedorId: vendedor._id.toString(),
          nombre: 'zzzzz',
          page: 1,
          limit: 10
        });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBe(0);
    });
  });
});
