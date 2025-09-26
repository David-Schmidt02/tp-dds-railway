
// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../dominio/pedido.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Producto } from '../dominio/producto.js';
import { PedidoRepository } from '../src/repositories/pedidoRepository.js';

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
    
/*
     async crearComanda(mesa, platos) {
    const platosPedidos = await Promise.all(platos.map(async p =>
      new PlatoPedido(
        await this.menu.obtenerPlatoPorId(p.idPlato),
        p.cantidad,
        p.notas
      )
    ));
    return await this.comandaRepository.agregarComanda(new Comanda(mesa, platosPedidos))
  }
*/

    obtenerPedido(id) {
        return this.pedidoRepository.obtenerPedidoPorId(id);
    }

    obtenerPedidos() {
        return this.pedidoRepository.obtenerTodosLosPedidos();
    }

}