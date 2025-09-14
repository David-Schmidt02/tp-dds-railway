
export class FactoryNotificacion {
    // Mapea una instancia de Pedido a un objeto JSON con los campos requeridos
    static crearSegunEstadoPedido(pedido) {
        switch (pedido.estado.nombre) {
            case 'PENDIENTE':
                return {
                    comprador: pedido.comprador,
                    productos: pedido.itemsPedido?.map(item => item.producto?.nombre),
                    total: pedido.total,
                    direccionEntrega: pedido.direccionEntrega
                };
            case 'ENVIADO':
                return {
                    comprador: pedido.comprador,
                    productos: pedido.itemsPedido?.map(item => item.producto?.nombre),
                    fechaEntrega: Date.now(),
                    estado: pedido.estado
                };
            case 'CANCELADO':
                return {
                    comprador: pedido.comprador,
                };
        }
    }

    static crearSegunPedido(pedido) {
        const mensaje = FactoryNotificacion.crearSegunEstadoPedido(pedido);
        //return new Notificaciones(pedido.receptor, mensaje);
        
    }
}


export class Notificaciones {
    id;
    receptor;
    mensaje;
    fechaAlta;
    leida;
    fechaLeida;

    constructor(receptor, mensaje) {
        this.receptor = usuario;
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