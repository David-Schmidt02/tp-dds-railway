import { Notificacion } from '../dominio/notificacion.js'


export class notificacionController {
    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

   async obtenerNotificacionesDeUnUsuario(req, res) {
   try {
        const { usuarioId, leida } = req.query;
        const filtroLeida = leida === undefined ? undefined : leida === 'true';
        const notificaciones = await this.notificacionesService.obtenerNotificacionesDeUnUsuario(usuarioId, filtroLeida);
        return res.status(200).json(notificaciones);
   }catch(error){
        return res.status(500).json({ error: 'Error al obtener los pedidos.' });
   }
   };

}

export default notificacionController;
