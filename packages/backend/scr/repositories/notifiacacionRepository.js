import { } from "../excepciones/"

export const NotificacionesRepository = {
    notificaciones: [],

    agregarNotificacion(notificacion) {
        notificacion.id = this.obtenerSiguienteId()
        this.notificaciones.push(notificacion)
        return notificacion
    },

    obtenerPorId(id){
        const notificacion = this.notificaciones.find(n => n.id === id);
        if(!notificacion) {
            throw new NotificacionInexistente(id)
        }
        return notificacion;
    },

    obtenerNoLeidas(){
        return this.notificaciones.filter(n => !n.leida)
    },

    obtenerSiguienteId() {//TODO en una DB real no es necesario
        return (this.notificaciones[this.notificaciones.length - 1]?.id || 0) + 1;
    }

}