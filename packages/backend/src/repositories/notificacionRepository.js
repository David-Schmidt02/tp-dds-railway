import mongoose from "mongoose";
import { NotificacionInexistente } from "../excepciones/notificacion.js";
import { NotificacionModel } from '../schema/notificacionSchema.js';

export class NotificacionRepository {
    constructor() {
        // No necesitas db con Mongoose
    }

    async crear(notificacion) {
        return await NotificacionModel.create(notificacion);
    }

    async obtenerPorUsuario(usuarioId) {
        return await NotificacionModel.find({ receptorId: usuarioId });
    }

    async marcarComoLeida(id) {
        return await NotificacionModel.findByIdAndUpdate(
            id, 
            { leida: true, fechaLeida: new Date() }, 
            { new: true }
        );
    }

    async obtenerTodos() {
        return await NotificacionModel.find();
    }

    async agregarNotificacion(usuarioId, notificacion) {
        const notificacionExistente = await NotificacionModel.findOne({ receptorId: usuarioId });
        if (notificacionExistente) {
            throw new NotificacionInexistente("Ya existe una notificación para este usuario");
        }
        return await NotificacionModel.create({ receptorId: usuarioId, ...notificacion });
    }

    async obtenerNotificacionesDeUnUsuario(usuarioId, leida) {
         const filtro = { usuarioId };
         if (leida !== undefined) {
            filtro.leida = leida; // true o false
         }
         return await NotificacionModel.find(filtro);
    }
}