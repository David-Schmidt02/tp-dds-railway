export class NotificacionService {
    constructor(notificacionRepository, usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async obtenerNotificacionesDeUnUsuario(usuarioId, leida) {
        // Validar que el usuario existe
        await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);

        return await this.notificacionRepository.obtenerNotificacionesDeUnUsuario(usuarioId, leida);
    }

    async marcarComoLeida(notificacionId) {
        return await this.notificacionRepository.marcarComoLeida(notificacionId);
    }
}
