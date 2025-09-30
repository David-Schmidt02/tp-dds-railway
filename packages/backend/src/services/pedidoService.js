
// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../dominio/pedido.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Producto } from '../dominio/producto.js';
import { PedidoRepository } from '../repositories/pedidoRepository.js';

export class PedidoService {
    constructor(pedidoRepository, productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository
    }

    async crearPedido(pedidoJSON) {
      const { comprador, items, moneda, direccionEntrega } = pedidoJSON;
      console.log('Comprador:', comprador);
      console.log('Items:', items);
      console.log('Moneda:', moneda);
      console.log('Direccion de Entrega:', direccionEntrega);
        
       const itemsPedidos = await Promise.all(items.map(async it =>
       new ItemPedido(
       await this.productoRepository.obtenerProductoPorId(it.producto.id),
       await this.productoRepository.obtenerProductoPorId(it.producto.id),

        // alternativa: usar el atributo "Stock" del producto para validar la cantidad. 
        // Desventaja: Es complicada despues saber el stock real porque quedaria cada item con su propio stock

        await this.productoRepository.obtenerProductoPorId(it.producto.id)
      )
    ));


        
        const pedidoNuevo = new Pedido(comprador, items, moneda, direccionEntrega);
        const pedidoGuardado = this.pedidoRepository.crearPedido(pedidoNuevo);
        return pedidoGuardado;
    }

    async cancelarPedido(id, motivo, usuario) {
      const pedido = await this.pedidoRepository.obtenerPedidoPorId(id);
      if (!pedido) {
        throw new Error('Pedido no encontrado');
      }
      pedido.actualizarEstado('CANCELADO', usuario, motivo);
      const pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido);
      pedido.items.forEach(async (item) => {
        await this.productoRepository.cancelarStock(item.producto, item.cantidad);
      });
      return pedidoActualizado;
    }
    

}