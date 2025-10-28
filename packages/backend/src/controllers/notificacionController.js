import { notificacionesToDTO } from '../dto/notificacionDTO.js';

export class NotificacionController {
    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    async obtenerNotificacionesDeUnUsuario(req, res, next) {
        try {
            const { idUsuario } = req.params;
            const { leida } = req.query;
            const filtroLeida = leida === undefined ? undefined : leida === 'true';
            const notificaciones = await this.notificacionService.obtenerNotificacionesDeUnUsuario(idUsuario, filtroLeida);
            return res.status(200).json(notificacionesToDTO(notificaciones));
        } catch(error) {
            next(error);
        }
    }

    async marcarNotificacionComoLeida(req, res, next) {
        try {
            const { idNotificacion } = req.params;
            if (!idNotificacion) {
                return res.status(400).json({ message: 'Se requiere el ID de la notificación' });
            }

            // TODO: Validar que el usuario que marca la notificación sea el receptor (seguridad)
            // Actualmente cualquier usuario con el ID de la notificación puede marcarla como leída

            await this.notificacionService.marcarComoLeida(idNotificacion);
            res.status(200).json({ message: 'Notificación marcada como leída' });
        } catch (error) {
            next(error);
        }
    }
}

export default NotificacionController;
