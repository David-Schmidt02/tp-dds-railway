export class NotificacionInexistente extends Error {
  constructor(id) {
    super(`La notificacion con id: ${id}, no existe`);
  }
}

// Esto no es necesario ahora pero si cuando se exponga la api
