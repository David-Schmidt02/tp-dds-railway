import express from 'express'
import {startServer} from "./src/app/server.js";
import {connectToDB} from "./src/app/db.js";
import {buildAppContext} from "./src/app/context.js";

const app = express()
const PORT = 3000
const DB_URI = "mongodb://localhost:27017/local";

let appContext = {};
try {
  console.log('Intentando conectar a MongoDB...');
  const DB_CLIENT = await connectToDB(DB_URI);
  console.log('Conexión a MongoDB exitosa, construyendo contexto...');
  
  appContext = buildAppContext(DB_CLIENT);
  console.log('Contexto construido exitosamente:', Object.keys(appContext));
  
} catch (err) {
  console.warn('No se pudo conectar a la base de datos. El servidor se inicia en modo desarrollo.');
  console.error('Error específico:', err.message);
  console.error('Stack trace:', err.stack);
  
  appContext = {
    pedidoController: {
      crearPedido: (req, res) => res.status(503).json({ error: 'Funcionalidad no disponible en modo desarrollo.' }),
      obtenerPedidos: (req, res) => res.status(503).json({ error: 'Funcionalidad no disponible en modo desarrollo.' }),
      cancelarPedido: (req, res) => res.status(503).json({ error: 'Funcionalidad no disponible en modo desarrollo.' })
    },
    productoController: {
      obtenerProductos: (req, res) => res.status(503).json({ error: 'Funcionalidad no disponible en modo desarrollo.' })
    }
  };
}

startServer(app, PORT, appContext);