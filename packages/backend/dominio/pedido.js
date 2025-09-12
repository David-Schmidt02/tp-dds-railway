export class Pedido {
    id
    comprador
    items
    total
    moneda
    direccionEntrega
    estado
    fechaCreacion
    historialEstados

    constructor(comprador, items, moneda, direccionEntrega) {
        this.id = PedidoRepository.siguienteId(); // TODO: Pedidorepository
        this.comprador = comprador;
        this.itemsPedido = [];
        this.total = 0;
        this.moneda = moneda; 
        this.direccionEntrega = direccionEntrega; 
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = Date.now();
        this.historialEstados = []; 

    }

    calcularTotal() { return this.itemsPedido.reduce((acc, item) => acc + item.subtotal(), 0) }

    
    actualizarEstado(nuevoEstado, usuario, motivo ) {
        estado = new EstadoPedido.nuevoEstado
	    this.estado = estado
	    new CambioEstadoPedido(estado, this, usuario, motivo)
    }
    
    validarStock() { return this.itemsPedido.every(item => item.producto.estaDisponible(item.cantidad)) }

    obtenerVendedores() { 
    const vendedores = new Set();
    for (const item of this.itemsPedido) {
        if (item.producto && item.producto.vendedor) {
            vendedores.add(item.producto.vendedor);
        }
    }
    return Array.from(vendedores);
    }
}



