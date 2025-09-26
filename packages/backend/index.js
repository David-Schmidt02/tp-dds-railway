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

app.get('/healthCheck', (req, res) => {
  res.status(200).json({mensaje:'Todo marcha bien!'})
})

// wiring Repo -> Service -> Controller
const pedidoRepository = new PedidoRepository();
const productoRepository = RepositorioProducto; // No uses "new"
const pedidoService = new PedidoService(pedidoRepository, productoRepository);
const pedidoController = new PedidoController(pedidoService);

const server = new Server(app, process.env.PORT || 3000);

// registrar controller
server.setController(PedidoController, pedidoController);
server.routes = routes;

// montar y arrancar
server.configureRoutes();
server.launch();