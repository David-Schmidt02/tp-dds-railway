import {
  UsuarioYaExiste,
  UsuarioInexistente,
  EmailInvalido,
  DatosUsuarioInvalidos,
  CredencialesInvalidas,
  UsuarioInactivo,
  PermisosInsuficientes
} from '../excepciones/usuario.js';

export function usuarioErrorHandler(err, req, res, next) {
  if (err.constructor.name === UsuarioYaExiste.name) {
    return res.status(409).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === UsuarioInexistente.name) {
    return res.status(404).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === EmailInvalido.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === DatosUsuarioInvalidos.name) {
    return res.status(400).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === CredencialesInvalidas.name) {
    return res.status(401).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === UsuarioInactivo.name) {
    return res.status(403).json({ error: err.name, message: err.message });
  }

  if (err.constructor.name === PermisosInsuficientes.name) {
    return res.status(403).json({ error: err.name, message: err.message });
  }

  // Si no es un error de usuario, pasar al siguiente middleware
  next(err);
}
