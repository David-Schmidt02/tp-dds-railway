// packages/backend/index.js
import { Server } from "./server.js";
import routes from "./routes/routes.js";

import "dotenv/config";
import express from "express";
import cors from "cors";

import { PedidoController } from "./controllers/pedidoController.js";
import { PedidoService } from "./services/pedidoService.js";
import { PedidoRepository } from "./src/repositories/pedidoRepository.js";

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
      : true,
  }),
);

// endpoint de prueba
app.get("/hello", (req, res) => res.json({ message: "hello world" }));

// wiring Repo -> Service -> Controller
const pedidoRepository = new PedidoRepository();
const pedidoService = new PedidoService(pedidoRepository);
const pedidoController = new PedidoController(pedidoService);

const server = new Server(app, process.env.PORT || 3000);

// registrar controller
server.setController(PedidoController, pedidoController);

server.routes = routes;

// montar y arrancar
server.configureRoutes();
server.launch();
