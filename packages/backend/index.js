import express from 'express'
import { startServer } from "./src/app/server.js";
import { connectToDB } from "./src/app/db.js";
import { buildAppContext } from "./src/app/context.js";
import { setupSwagger } from "./src/app/swagger.js"; 

const app = express();
const PORT = 3000;
const DB_URI = "mongodb://localhost:27017/desarrollo?replicaSet=rs0";

let appContext = {};
try {
  console.log('Intentando conectar a MongoDB...');
  const DB_CLIENT = await connectToDB(DB_URI);
  console.log('Conexión a MongoDB exitosa, construyendo contexto...');
  
  appContext = buildAppContext(DB_CLIENT);
  console.log('Contexto construido exitosamente:', Object.keys(appContext));

  setupSwagger(app);

} catch (err) {
  console.warn('No se pudo conectar a la base de datos. El servidor se inicia en modo desarrollo.');
  console.error('Error específico:', err.message);
  console.error('Stack trace:', err.stack);
  
  setupSwagger(app);
}

startServer(app, PORT, appContext);
