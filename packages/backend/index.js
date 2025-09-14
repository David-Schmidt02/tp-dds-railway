import { PedidoController } from "./controllers/pedidoController.js";
import { pedidos } from "./controllers/pedidoController.js";
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/pedidos", PedidoController.obtenerPedidos);
app.post("/pedidos", PedidoController.crearPedido);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});
