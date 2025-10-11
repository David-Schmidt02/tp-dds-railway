import { notificacionesToDTO } from '../dto/notificacionDTO.js';

export class NotificacionController {
    constructor(notificacionRepository) {
        this.notificacionRepository = notificacionRepository;
    }

    async obtenerNotificacionesDeUnUsuario(req, res) {
        try {
            const { usuarioId, leida } = req.query;
            const filtroLeida = leida === undefined ? undefined : leida === 'true';
            const notificaciones = await this.notificacionRepository.obtenerNotificacionesDeUnUsuario(usuarioId, filtroLeida);
            return res.status(200).json(notificacionesToDTO(notificaciones));
        } catch(error) {
            console.error('Error al obtener notificaciones:', error);
            return res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }

    async marcarNotificacionComoLeida(req, res) {
        try {
            const { notificacionId } = req.body;
            if (!notificacionId) {
                return res.status(400).json({ message: 'Se requiere el ID de la notificación' });
            }

            await this.notificacionRepository.marcarComoLeida(notificacionId);
            res.status(200).json({ message: 'Notificación marcada como leída' });
        } catch (error) {
            console.error('Error al marcar notificación como leída:', error);
            res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }
}

export default NotificacionController;
