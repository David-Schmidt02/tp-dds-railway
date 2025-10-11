import {
  ProductoInexistente,
  ProductoStockInsuficiente,
  ProductoSinStock,
  ProductoNoDisponible,
  CategoriaInvalida,
  PrecioInvalido
} from '../excepciones/producto.js';

export function productoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  if (err.constructor.name === ProductoInexistente.name) {
    return res.status(404).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === ProductoStockInsuficiente.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === ProductoSinStock.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === ProductoNoDisponible.name) {
    return res.status(404).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === CategoriaInvalida.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === PrecioInvalido.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  res.status(500).json({ error: 'Error', message: 'Ups. Algo sucedió en el servidor.' });
}
