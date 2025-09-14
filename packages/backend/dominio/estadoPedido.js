export class EstadoPedido {
    nombre;
    destinos;
    constructor(nombre, destinos = []){ 
        this.nombre = nombre 
        this.destinos = new Set(destinos);

    }

    puedeTransicionarA(estadoDestino){
        return this.destinos.has(estadoDestino);
    }
    

}

EstadoPedido.PENDIENTE = new EstadoPedido("PENDIENTE", [EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO]);
EstadoPedido.CONFIRMADO = new EstadoPedido("CONFIRMADO", [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO]);
EstadoPedido.EN_PREPARACION = new EstadoPedido("EN_PREPARACION", [EstadoPedido.ENVIADO, EstadoPedido.CANCELADO]);
EstadoPedido.ENVIADO = new EstadoPedido("ENVIADO", [EstadoPedido.ENTREGADO]);
EstadoPedido.ENTREGADO = new EstadoPedido("ENTREGADO", []);
EstadoPedido.CANCELADO = new EstadoPedido("CANCELADO", []);