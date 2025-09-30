/*
// packages/backend/index.js
import { Server } from "./server.js";
import routes from "./routes/routes.js";

import "dotenv/config";
import express from "express";
import cors from "cors";

import { PedidoController } from "./controllers/pedidoController.js";
import { PedidoService } from "./services/pedidoService.js";
import { PedidoRepository } from "./src/repositories/pedidoRepository.js";
import { RepositorioProducto } from "./src/repositories/productoRepository.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
      : true,
  }),
);

const server = new Server(app, process.env.PORT || 3000);

// registrar controller
server.setController(PedidoController, pedidoController);
server.routes = routes;

// montar y arrancar
server.configureRoutes();
server.launch();

*/

import express from 'express'
import {startServer} from "./src/app/server.js";
import {connectToDB} from "./src/app/db.js";
import {buildAppContext} from "./src/app/context.js";

const app = express()
const PORT = 3000
const DB_URI = "mongodb://localhost:27017";


let appContext = {};
try {
  const DB_CLIENT = await connectToDB(DB_URI);
  appContext = buildAppContext(DB_CLIENT);
} catch (err) {
  console.warn('No se pudo conectar a la base de datos. El servidor se inicia en modo desarrollo.');
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