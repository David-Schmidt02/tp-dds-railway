import {
  PedidoInexistente,
  PedidoNoModificable,
  PedidoNoCancelable,
  EstadoPedidoInvalido,
  PedidoYaCancelado,
  PedidoYaEntregado
} from '../excepciones/pedido.js';

import { productoErrorHandler } from './productoErrorHandler.js';
import { usuarioErrorHandler } from './usuarioErrorHandler.js';

export function pedidoErrorHandler(err, req, res, next) {
  console.log(err.message);

  // Errores de Pedido
  if (err.constructor.name === PedidoInexistente.name) {
    return res.status(404).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === PedidoNoModificable.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === PedidoNoCancelable.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === EstadoPedidoInvalido.name) {
    return res.status(422).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === PedidoYaCancelado.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === PedidoYaEntregado.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  // Si no es un error de pedido, delegar a otros middlewares
  // Intentar con el middleware de productos
  productoErrorHandler(err, req, res, (err) => {
    if (err) {
      // Si el middleware de productos no lo manejó, intentar con usuarios
      usuarioErrorHandler(err, req, res, (err) => {
        if (err) {
          // Si ninguno lo manejó, error genérico
          res.status(500).json({ error: 'Error', message: 'Ups. Algo sucedió en el servidor.' });
        }
      });
    }
  });
}
