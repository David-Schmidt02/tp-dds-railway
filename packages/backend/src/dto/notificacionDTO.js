export function notificacionToDTO(notificacion) {
    return {
        id: notificacion._id || notificacion.id,
        receptor: {
            id: notificacion.receptor?.id || notificacion.receptorId || notificacion.usuarioId,
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
