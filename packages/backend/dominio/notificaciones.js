
export class FactoryNotificacion {
    static crearSegunEstadoPedido(estadoPedido) {
        let mensaje;
        switch (estadoPedido) {
            case 'pendiente':
                mensaje = 'Tu pedido está pendiente.';
                break;
            case 'enviado':
                mensaje = 'Tu pedido ha sido enviado.';
                break;
            case 'entregado':
                mensaje = 'Tu pedido ha sido entregado.';
                break;
            default:
                mensaje = 'Estado de pedido actualizado.';
        }
        return mensaje;
    }

    static crearSegunPedido(pedido) {
        const mensaje = FactoryNotificacion.crearSegunEstadoPedido(pedido.estado);
        return new Notificaciones(pedido.usuario, mensaje);
    }
}

export class Notificaciones {
    id;
    usuario;
    mensaje;
    fechaAlta;
    leida;
    fechaLeida;

    constructor(usuario, mensaje) {
        this.usuario = usuario;
        this.mensaje = mensaje;
        this.fechaAlta = new Date();
        this.leida = false;
        this.fechaLeida = null;
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaLeida = new Date();
    }
}