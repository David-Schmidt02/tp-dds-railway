import { notificacionesToDTO } from '../dto/notificacionDTO.js';

export class NotificacionController {
    constructor(notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    async obtenerNotificacionesDeUnUsuario(req, res, next) {
        try {
            const { usuarioId, leida } = req.query;

            if (!usuarioId) {
                return res.status(400).json({ message: 'Se requiere el ID del usuario' });
            }

            const filtroLeida = leida === undefined ? undefined : leida === 'true';
            const notificaciones = await this.notificacionRepository.obtenerNotificacionesDeUnUsuario(usuarioId, filtroLeida);
            return res.status(200).json(notificacionesToDTO(notificaciones));
        } catch(error) {
            next(error);
        }
    }

    async marcarNotificacionComoLeida(req, res, next) {
        try {
            const { notificacionId } = req.body;
            if (!notificacionId) {
                return res.status(400).json({ message: 'Se requiere el ID de la notificación' });
            }

            // TODO: Validar que el usuario que marca la notificación sea el receptor (seguridad)
            // Actualmente cualquier usuario con el ID de la notificación puede marcarla como leída
            await this.notificacionRepository.marcarComoLeida(notificacionId);
            res.status(200).json({ message: 'Notificación marcada como leída' });
        } catch (error) {
            next(error);
        }
    }
}

export default NotificacionController;
