import mongoose from "mongoose";
import { NotificacionInexistente } from "../../excepciones/notificacion.js";
import { NotificacionModel } from '../../schema/notificacionSchema.js';

export class NotificacionRepository {
    constructor() {
        // No necesitas db con Mongoose
    }

    async obtenerNotificacion(notificacionId) {
    return await NotificacionModel.findById(notificacionId).populate('receptor');
    }

    async saveNotificacionNueva(notificacion) {
        const data = {
            receptor: notificacion.receptorId,
            mensaje: notificacion.mensaje,
            leida: notificacion.leida,
            fechaAlta: notificacion.fechaAlta || new Date(),
            fechaLeida: notificacion.fechaLeida || null
        }

        const notificacionDB = new NotificacionModel(data);
        const saved = await notificacionDB.save();
        return saved;
    }

    async guardarNotificacion(notificacion) {
        const data = {
            mensaje: notificacion.mensaje,
            receptor: notificacion.receptorId,
            fechaAlta: notificacion.fechaAlta,
            leida: notificacion.leida,
            fechaLeida: notificacion.fechaLeida
        };
        const filtro = notificacion.id ? {_id: notificacion.id} : {}
        console.log(data)
        console.log(filtro)

        const updated = await NotificacionModel.findOneAndUpdate(
            filtro,
            data,
            {
                new: true,
                runValidators: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        ).populate('receptor');
        if (!updated) {
            throw new NotificacionInexistente();
        }
        return updated;
    }

    async obtenerTodos() {
    return await NotificacionModel.find().populate('receptor');
    }


    async obtenerNotificacionesDeUnUsuario(usuarioId, leida) {
            const filtro = { receptor: usuarioId };
            if (leida !== undefined) {
                filtro.leida = leida; // true o false
            }
            return await NotificacionModel.find(filtro).populate('receptor');
    }
}
