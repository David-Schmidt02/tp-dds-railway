import { Notificacion } from "../models/entities/notificacion.js"

export function notificacionToDTO(notificacion) {
    return {
        id: notificacion._id,
        receptor: {
            id: notificacion.receptor?._id || notificacion.receptorId || notificacion.usuarioId,
            nombre: notificacion.receptor?.nombre,
            email: notificacion.receptor?.email
        },
        mensaje: notificacion.mensaje,
        leida: notificacion.leida || false,
        fechaAlta: notificacion.fechaAlta || notificacion.createdAt || new Date(),
        fechaLeida: notificacion.fechaLeida || null
    };
}

export function notificacionesToDTO(notificaciones) {
    return notificaciones.map(notificacionToDTO);
}


export function notificacionDocADominio(notiDoc) {
    return new Notificacion (
        notiDoc.receptor.id,
        notiDoc.mensaje,
        notiDoc.leida,
        notiDoc.fechaAlta,
        notiDoc.id
    )
}