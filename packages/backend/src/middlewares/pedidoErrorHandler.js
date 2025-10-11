import {
  PedidoInexistente,
  PedidoNoModificable,
  PedidoNoCancelable,
  EstadoPedidoInvalido,
  PedidoYaCancelado,
  PedidoYaEntregado
} from '../excepciones/pedido.js';

export function pedidoErrorHandler(err, _req, res, _next) {
  console.log(err.message);

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

  res.status(500).json({ error: 'Error', message: 'Ups. Algo sucedió en el servidor.' });
}
