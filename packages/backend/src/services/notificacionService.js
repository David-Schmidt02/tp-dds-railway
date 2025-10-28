import { Notificacion } from "../models/entities/notificacion.js"
import { notificacionDocADominio } from "../dto/notificacionDTO.js";

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
        let notificacionDoc = await this.notificacionRepository.obtenerNotificacion(notificacionId);
        const notificacion = notificacionDocADominio(notificacionDoc);

        notificacion.marcarComoLeida();
        
        return await this.notificacionRepository.guardarNotificacion(notificacion);
    }
}
