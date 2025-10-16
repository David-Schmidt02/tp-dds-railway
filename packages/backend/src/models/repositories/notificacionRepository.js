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

    async guardarNotificacion(notificacion) {
        // Si tiene id o _id, es update; si no, es create
        const id = notificacion._id || notificacion.id;
        const query = id ? { _id: id } : { _id: new NotificacionModel()._id };

        // Extraer datos desde la instancia de dominio
        const data = {
            mensaje: notificacion.mensaje,
            receptorId: notificacion.receptor._id,
            fechaAlta: notificacion.fechaAlta,
            leida: notificacion.leida,
            fechaLeida: notificacion.fechaLeida
        };

        const updated = await NotificacionModel.findOneAndUpdate(
            query,
            data,
            {
                new: true,
                runValidators: true,
                upsert: true
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
            const filtro = { receptorId: usuarioId };
            if (leida !== undefined) {
                filtro.leida = leida; // true o false
            }
            return await NotificacionModel.find(filtro).populate('receptor');
    }
}
