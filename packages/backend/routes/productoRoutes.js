import { productosController } from "../controllers/productosController.js";
import express from "express";

const pathProductos = "/productos";

export default function productoRoutes(getController) {
  const router = express.Router();

  router.get(pathProductos, (req, res) => {
    getController(productosController).obtenerProductos(req, res);
  });

  return router;
}