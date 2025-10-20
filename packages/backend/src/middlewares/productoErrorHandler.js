import {
  ProductoInexistente,
  ProductoStockInsuficiente,
  ProductoSinStock,
  ProductoNoDisponible,
  CategoriaInvalida,
  PrecioInvalido,
  ProductoInactivo
} from '../excepciones/producto.js';

import { usuarioErrorHandler } from './usuarioErrorHandler.js';

export function productoErrorHandler(err, req, res, next) {
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

  if (err.constructor.name === ProductoInactivo.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  // Si no es un error de producto, delegar a usuarioErrorHandler
  usuarioErrorHandler(err, req, res, (err) => {
    if (err) {
      // Si tampoco es de usuario, pasar al siguiente middleware
      next(err);
    }
  });
}
