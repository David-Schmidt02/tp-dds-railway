import { PedidoController } from "../controllers/pedidoController.js";
import express from "express";

const pathPedido = "/pedidos";

export default function pedidoRoutes(getController) {
  const router = express.Router();

  router.post(pathPedido, (req, res) => {
    getController(PedidoController).crearPedido(req, res);
  });

  router.get(pathPedido, (req, res) => {
    getController(PedidoController).obtenerPedidos(req, res);
  });

  return router;
}