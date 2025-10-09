
export class NotificacionesService {
  constructor() {
    this.repository = new NotificacionesRepository();
  }

   async obtenerNotificacionesDeUnUsuario(usuarioId, filtroLeida) {
      return await this.repository.obtenerNotificacionesDeUnUsuario(usuarioId, filtroLeida);
    }

 }
