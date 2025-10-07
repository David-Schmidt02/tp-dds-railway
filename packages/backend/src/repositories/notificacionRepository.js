import mongoose from "mongoose";
import { NotificacionInexistente } from "../excepciones/notificaciones.js";
import { NotificacionModel } from "../schema/notificacionSchema.js";

export class NotificacionRepository {
    constructor() {
        this.model = NotificacionModel;
    }

    async agregarNotificacion(notificacion) {
        const nuevaNotificacion = new this.model(notificacion);
        const resultado = await nuevaNotificacion.save();
        return {
            
            ...resultado.toObject(),
            id: resultado._id.toString()
        };
    }

    async obtenerPorId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new NotificacionInexistente(id);
        }
        
        const notificacion = await this.model.findById(id);
        if (!notificacion) {
            throw new NotificacionInexistente(id);
        }
        
        return {
            ...notificacion.toObject(),
            id: notificacion._id.toString()
        };
    }

    async obtenerNoLeidas() {
        const notificaciones = await this.model.find({ leida: false });
        return notificaciones.map(notificacion => ({
            ...notificacion.toObject(),
            id: notificacion._id.toString()
        }));
    }

    async marcarComoLeida(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new NotificacionInexistente(id);
        }
        
        await this.model.findByIdAndUpdate(id, { leida: true });
    }

    async obtenerTodasLasNotificaciones() {
        const notificaciones = await this.model.find();
        return notificaciones.map(notificacion => ({
            ...notificacion.toObject(),
            id: notificacion._id.toString()
        }));
    }

    async eliminarNotificacion(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }
        
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }
}