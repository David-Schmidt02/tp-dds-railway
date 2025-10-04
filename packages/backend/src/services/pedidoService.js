
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
       await this.productoRepository.reservarStock(it.producto.id),

        // alternativa: usar el atributo "Stock" del producto para validar la cantidad. 
        // Desventaja: Es complicada despues saber el stock real porque quedaria cada item con su propio stock

        await this.productoRepository.obtenerPrecioUnitario(it.producto.id)
      )
    ));
        const pedidoNuevo = new Pedido(comprador, items, moneda, direccionEntrega);
        const pedidoGuardado = this.pedidoRepository.crearPedido(pedidoNuevo);
        return pedidoGuardado;
    }

    async cancelarPedido(id, motivo, usuario) {
      const pedido = await this.pedidoRepository.obtenerPedidoPorId(id);
      const pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido.id, 'CANCELADO');
      pedido.items.forEach(async (item) => {
        await this.productoRepository.cancelarStock(item.producto.id, item.cantidad);
      });
      return pedidoActualizado;
    }

    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
      const pedido = await this.pedidoRepository.obtenerPedidoPorId(idPedido);
      if (!pedido) {
          throw new Error('Pedido no encontrado'); // tiene que haber una excepcion
      }
      cantidadPrevia = pedido.obtenerCantidadItem(idItem)
      diferencia = nuevaCantidad - cantidadPrevia
      // Una diferencia negativa reservar Stock no debe tener problemas nunca, se piden menos items
      // Una diferencia positiva implica mayores items
      
      // Que el repository tenga stock y que el pedido este antes del estado 'ENVIADO' 2 verificaciones.
      if (pedido.puedeModificarItems() && this.productoRepository.tieneStock(idItem, diferencia)) {
          if(diferencia > 0)
               await this.productoRepository.reservarStock(idItem, diferencia);
          else
               await this.productoRepository.cancelarStock(idItem, -diferencia);
          
          pedido.modificarCantidadItem(idItem, nuevaCantidad);
          return pedido;
      }
      throw new Error('No se puede modificar la cantidad del item');
    }
}