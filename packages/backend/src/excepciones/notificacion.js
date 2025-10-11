export class NotificacionInexistente extends Error {
  constructor(id) {
    super(`La notificacion con id: ${id}, no existe`);
    this.name = 'NotificacionInexistente';
  }
}

export class EstadoNoSoportado extends Error {
  constructor(nombre) {
    super(`Estado no soportado ${nombre}`);
    this.name = 'EstadoNoSoportado';
  }
}
