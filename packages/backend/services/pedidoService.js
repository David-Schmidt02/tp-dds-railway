
// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../dominio/pedido.js';
import { PedidoRepository } from '../src/repositories/pedidoRepository.js';

export class PedidoService {
    constructor(pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    crearPedido(pedidoJSON) {
        const { comprador, items, moneda, direccionEntrega } = pedidoJSON;
        const pedidoNuevo = new Pedido(comprador, items, moneda, direccionEntrega);
        const pedidoGuardado = this.pedidoRepository.crearPedido(pedidoNuevo);
        return pedidoGuardado;
    }

    obtenerPedido(id) {
        return this.pedidoRepository.obtenerPedidoPorId(id);
    }

    obtenerPedidos() {
        return this.pedidoRepository.obtenerTodosLosPedidos();
    }

}