// test/setup.js
process.env.NODE_ENV = 'test';

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.setTimeout(180000); // 3 minutos por si tiene que descargar binarios

let mongo;

async function connectWithMemoryServer() {
  // Fijar versión estable (mejora MUCHO en Windows)
  mongo = await MongoMemoryServer.create({
    binary: { version: '7.0.14' },
    instance: { dbName: 'testdb' }
  });
  const uri = mongo.getUri();
  console.log('[setup] mongodb-memory-server URI:', uri);

  await mongoose.connect(uri, { dbName: 'testdb' });
  await mongoose.connection.db.admin().ping();
  console.log('[setup] Mongoose conectado (memory).');
}

beforeAll(async () => {
  console.log('[setup] beforeAll start');

  // Opción de fallback: si tenés un Mongo local en tu máquina, setea MONGODB_URI_TEST
  const externalUri = process.env.MONGODB_URI_TEST;

  try {
    if (externalUri) {
      console.log('[setup] Intentando conectar a Mongo externo:', externalUri);
      await mongoose.connect(externalUri, {});
      await mongoose.connection.db.admin().ping();
      console.log('[setup] Mongoose conectado (externo).');
    } else {
      console.log('[setup] Intentando iniciar mongodb-memory-server...');
      await connectWithMemoryServer();
    }
  } catch (err) {
    console.error('[setup] Falla en conexión inicial:', err?.message);
    if (!externalUri) {
      console.log('[setup] Reintentando con mongodb-memory-server como fallback…');
      await connectWithMemoryServer();
    } else {
      throw err;
    }
  }
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map(c => c.deleteMany({})));
});

afterAll(async () => {
  console.log('[setup] afterAll start');
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.connection.close().catch(() => {});
  }
  if (mongo) {
    await mongo.stop().catch(() => {});
  }
  console.log('[setup] cleanup done');
});
