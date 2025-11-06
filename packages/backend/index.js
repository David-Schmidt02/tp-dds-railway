import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { startServer } from "./src/app/server.js";
import { connectToDB } from "./src/app/db.js";
import { buildAppContext } from "./src/app/context.js";
import { setupSwagger } from "./src/app/swagger.js"; 

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  METHODS : ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true
}));

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

let appContext = {};
try {
  console.log('Intentando conectar a MongoDB...');
  const DB_CLIENT = await connectToDB(DB_URI);
  console.log('Conexión a MongoDB exitosa, construyendo contexto...');
  
  appContext = buildAppContext(DB_CLIENT);
  console.log('Contexto construido exitosamente:', Object.keys(appContext));

  setupSwagger(app);

} catch (err) {
  console.warn('No se pudo conectar a la base de datos. ');
  console.error('Error específico:', err.message);
  console.error('Stack trace:', err.stack);
  
  setupSwagger(app);
}

startServer(app, PORT, appContext);
