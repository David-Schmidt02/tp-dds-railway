
export class PedidoRepository {
    constructor() {
        this.pedidos = [];
        this.currentId = 1; 
    }
    crearPedido(pedido) {
        if (!pedido.id) {
            pedido.id = this.currentId++;
        }
        this.pedidos.push(pedido);
        return pedido;
    }
    obtenerPedidoPorId(id) {
        return this.pedidos.find(p => p.id === id);
    }
    obtenerTodosLosPedidos() {
        return this.pedidos;
    }
}