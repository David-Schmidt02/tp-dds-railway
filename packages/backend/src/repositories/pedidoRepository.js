import {PedidoInexistente} from "../excepciones/notificaciones.js";

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
        if(!producto){
        throw new PedidoInexistente(id);
        }
        return producto;
    }
    obtenerTodosLosPedidos() {
        return this.pedidos;
    }

  obtenerPrecioUnitario(id) {
    const pedido = this.obtenerPedidoPorId(id);
    if (!pedido || !pedido.precioUnitario) {
      return null;
    }
    return pedido.precioUnitario;
  }

  cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
    const pedido = this.obtenerPedidoPorId(idPedido);
    if (!pedido) {
        throw new Error('Pedido no encontrado');
    }
    
    pedido.modificarCantidadItem(idItem, nuevaCantidad);
  }

  actualizarPedido(id, nuevoEstado ,usuario, motivo){
    const pedido = this.obtenerPedidoPorId(idPedido);
    pedido.actualizarEstado(nuevoEstado, usuario, motivo);
    return pedido
  }
}




