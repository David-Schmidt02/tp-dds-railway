
import { jest } from '@jest/globals';


import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

jest.setTimeout(120000);

let __replset;

beforeAll(async () => {
  __replset = await MongoMemoryReplSet.create({
    binary: { version: '7.0.14' },          // estable en Windows
    replSet: { storageEngine: 'wiredTiger' } // requerido para transacciones
  });
  const uri = __replset.getUri();
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
  if (__replset) {
    await __replset.stop().catch(() => {});
  }
});

//imports de la app y modelos
import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';

import { configureRoutes } from '../../src/app/routes.js';
import { buildAppContext } from '../../src/app/context.js';

import { UsuarioModel } from '../../src/schema/usuarioSchema.js';
import { ProductoModel } from '../../src/schema/productoSchema.js';
import { NotificacionModel } from '../../src/schema/notificacionSchema.js';

describe('BDD: Creación de un pedido (POST /pedidos)', () => {
  let app;
  let vendedor;
  let comprador;
  let p1;
  let p2;
  let pInactivo;

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

    comprador = await UsuarioModel.create({
      nombre: 'Comprador Uno',
      email: 'comprador@ejemplo.com',
      telefono: '22222222',
      tipoUsuario: 'COMPRADOR',
    });

    p1 = await ProductoModel.create({
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

    p2 = await ProductoModel.create({
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

    pInactivo = await ProductoModel.create({
      vendedor: vendedor._id,
      titulo: 'Auriculares Viejos',
      descripcion: 'Modelo discontinuado',
      categorias: ['audio'],
      precio: 8000,
      moneda: 'ARS',
      stock: 20,
      fotos: [{ url: 'http://img/p3.png' }],
      activo: false,
      vendidos: 0
    });
  });

  describe('Happy path', () => {
    it('Given comprador y productos con stock, When crea pedido válido, Then 201, descuenta stock y genera notificación', async () => {
      const res = await request(app).post('/pedidos').send({
        usuarioId: comprador._id.toString(),
        items: [
          { productoId: p1._id.toString(), cantidad: 2 },
          { productoId: p2._id.toString(), cantidad: 1 }
        ],
        moneda: 'PESO_ARG',
        direccionEntrega: {
          calle: 'Av. Siempreviva',
          altura: 742,                
          piso: 1,
          departamento: 2,
          codigoPostal: 1405,
          ciudad: 'CABA',
          referencia: 'Timbre verde'
        }
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.total).toBe(35000); 

      const pp1 = await ProductoModel.findById(p1._id);
      const pp2 = await ProductoModel.findById(p2._id);
      expect(pp1.stock).toBe(8);
      expect(pp2.stock).toBe(4);

      const notifs = await NotificacionModel.find().lean();
      expect(notifs.length).toBe(1);
      expect(notifs[0].receptorId.toString()).toBe(vendedor._id.toString());
      expect(notifs[0].mensaje).toMatch(/Nuevo pedido/i);
    });
  });

  describe('Validaciones (400)', () => {
    it('Given body sin usuarioId, When POST /pedidos, Then 400 con detalle', async () => {
      const res = await request(app).post('/pedidos').send({
        items: [{ productoId: p1._id.toString(), cantidad: 1 }],
        moneda: 'PESO_ARG',
        direccionEntrega: {
          calle: 'X',
          altura: 1,                  
          piso: 1,
          departamento: 1,
          codigoPostal: 1000,
          ciudad: 'CABA',
          referencia: 'x'
        }
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Datos de entrada inválidos');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    it('Given cantidad 0, When POST /pedidos, Then 400', async () => {
      const res = await request(app).post('/pedidos').send({
        usuarioId: comprador._id.toString(),
        items: [{ productoId: p1._id.toString(), cantidad: 0 }],
        moneda: 'PESO_ARG',
        direccionEntrega: {
          calle: 'X',
          altura: 1,                   
          piso: 1,
          departamento: 1,
          codigoPostal: 1000,
          ciudad: 'CABA',
          referencia: 'x'
        }
      });
      expect(res.status).toBe(400);
    });
  });

  describe('Errores de negocio', () => {
    it('Given producto inexistente, When POST /pedidos, Then 404 ProductoInexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).post('/pedidos').send({
        usuarioId: comprador._id.toString(),
        items: [{ productoId: fakeId, cantidad: 1 }],
        moneda: 'PESO_ARG',
        direccionEntrega: {
          calle: 'X',
          altura: 1,                  
          piso: 1,
          departamento: 1,
          codigoPostal: 1000,
          ciudad: 'CABA',
          referencia: 'x'
        }
      });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ProductoInexistente');
    });

    it('Given producto inactivo, When POST /pedidos, Then 404 ProductoNoDisponible', async () => {
      const res = await request(app).post('/pedidos').send({
        usuarioId: comprador._id.toString(),
        items: [{ productoId: pInactivo._id.toString(), cantidad: 1 }],
        moneda: 'PESO_ARG',
        direccionEntrega: {
          calle: 'X',
          altura: 1,                 
          piso: 1,
          departamento: 1,
          codigoPostal: 1000,
          ciudad: 'CABA',
          referencia: 'x'
        }
      });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('ProductoNoDisponible');
    });

    it('Given stock insuficiente, When POST /pedidos, Then 409 ProductoStockInsuficiente', async () => {
      const res = await request(app).post('/pedidos').send({
        usuarioId: comprador._id.toString(),
        items: [{ productoId: p2._id.toString(), cantidad: 999 }],
        moneda: 'PESO_ARG',
        direccionEntrega: {
          calle: 'X',
          altura: 1,                   
          piso: 1,
          departamento: 1,
          codigoPostal: 1000,
          ciudad: 'CABA',
          referencia: 'x'
        }
      });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('ProductoStockInsuficiente');
    });
  });
});
