export class NotificacionInexistente extends Error {
  constructor(id) {
    super(`La notificacion con id: ${id}, no existe`);
  }
}

export class EstadoNoSoportado extends Error {
  constructor(nombre) {
    super(`Estado no soportado ${nombre}`);
  }
}

// Esto no es necesario ahora pero si cuando se exponga la api
