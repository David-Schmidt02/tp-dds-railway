export class EstadoPedido {
  nombre; destinos;
  constructor(nombre, destinos = []) {
    this.nombre = nombre;
    this.destinos = new Set(destinos);
  }
  // Verifica si el EstadoPedido tiene en sus posibles destinos al estadoDestino
  puedeTransicionarA(estadoDestino) { return this.destinos.has(estadoDestino); } 
}

EstadoPedido.PENDIENTE     = new EstadoPedido("PENDIENTE");
EstadoPedido.CONFIRMADO    = new EstadoPedido("CONFIRMADO");
EstadoPedido.EN_PREPARACION= new EstadoPedido("EN_PREPARACION");
EstadoPedido.ENVIADO       = new EstadoPedido("ENVIADO");
EstadoPedido.ENTREGADO     = new EstadoPedido("ENTREGADO");
EstadoPedido.CANCELADO     = new EstadoPedido("CANCELADO");

// Definimos las transiciones posibles entre estados
EstadoPedido.PENDIENTE.destinos      = new Set([EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO]);
EstadoPedido.CONFIRMADO.destinos     = new Set([EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO]);
EstadoPedido.EN_PREPARACION.destinos = new Set([EstadoPedido.ENVIADO, EstadoPedido.CANCELADO]);
EstadoPedido.ENVIADO.destinos        = new Set([EstadoPedido.ENTREGADO]);
EstadoPedido.ENTREGADO.destinos      = new Set([]);
EstadoPedido.CANCELADO.destinos      = new Set([]);

export function estadoPedidoFromString(estado) {
  switch (estado) {
    case "PENDIENTE": 
      return EstadoPedido.PENDIENTE;

    case "CONFIRMADO": 
      return EstadoPedido.CONFIRMADO;

    case "EN PREPARACION": 
      return EstadoPedido.EN_PREPARACION;

    case "ENVIADO": 
      return EstadoPedido.ENVIADO;

    case "ENTREGADO": 
      return EstadoPedido.ENTREGADO;

    case "CANCELADO": 
      return EstadoPedido.CANCELADO;
  }
}
