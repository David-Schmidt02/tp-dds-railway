import {
  NotificacionInexistente,
  EstadoNoSoportado
} from '../excepciones/notificacion.js';

export function notificacionErrorHandler(err, _req, res, _next) {
  console.log(err.message);

  if (err.constructor.name === NotificacionInexistente.name) {
    return res.status(404).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === EstadoNoSoportado.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  res.status(500).json({ error: 'Error', message: 'Ups. Algo sucedió en el servidor.' });
}
