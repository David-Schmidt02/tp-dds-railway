import {
  NotificacionInexistente,
  EstadoNoSoportado
} from '../excepciones/notificacion.js';

import { usuarioErrorHandler } from './usuarioErrorHandler.js';

export function notificacionErrorHandler(err, req, res, next) {
  console.log(err.message);

  if (err.constructor.name === NotificacionInexistente.name) {
    return res.status(404).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === EstadoNoSoportado.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  // Si no es un error de notificación, delegar a usuarioErrorHandler
  usuarioErrorHandler(err, req, res, (err) => {
    if (err) {
      // Si tampoco es de usuario, error genérico
      res.status(500).json({ error: 'Error', message: 'Ups. Algo sucedió en el servidor.' });
    }
  });
}
