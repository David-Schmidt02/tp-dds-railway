// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../dominio/pedido.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Producto } from '../dominio/producto.js';
import { PedidoRepository } from '../repositories/pedidoRepository.js';
import { PedidoInexistente } from '../excepciones/pedido.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import mongoose from 'mongoose';

export class PedidoService {
    constructor(pedidoRepository, productoRepository, notificacionRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.notificacionRepository = notificacionRepository;
        // No necesitas db con Mongoose
    }

    /**
     * Crea un pedido con manejo de transacciones para garantizar consistencia
     * Implementa control de concurrencia para evitar overselling
     */
    async crearPedido(pedidoJSON) {
         const { usuarioId, items, metodoPago, direccionEntrega, comentarios } = pedidoJSON;
        // Usar mongoose.startSession() en lugar de this.db.startSession()
        const session = await mongoose.startSession();
        
        let pedidoGuardado;
        
        await session.withTransaction(async () => {
            const itemsPedidos = [];
            
            // Reservar stock de todos los productos
            for (const itemData of items) {
                 const { productoId, cantidad } = itemData;

                const producto = await this.productoRepository.obtenerProductoPorId(productoId);
                await this.productoRepository.reservarStock(productoId, cantidad);
                const precioUnitario = await this.productoRepository.obtenerPrecioUnitario(productoId);

                const itemPedido = new ItemPedido(producto, cantidad, precioUnitario);
                itemsPedidos.push(itemPedido);
            }

            const pedidoNuevo = new Pedido(usuarioId, itemsPedidos, metodoPago, direccionEntrega, comentarios);
            pedidoGuardado = await this.pedidoRepository.guardarPedido(pedidoNuevo);
        });
        
        await session.endSession();
        return pedidoGuardado;
    }

    /**
     * Cancela un pedido y devuelve el stock reservado
     */
    async cancelarPedido(id, motivo, usuario) {
        // Cambiar this.db.startSession() por mongoose.startSession()
        const session = await mongoose.startSession();
        let pedidoActualizado;
        
        await session.withTransaction(async () => {
            const pedido = await this.pedidoRepository.obtenerPedidoPorId(id);
            
            pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido.id, 'CANCELADO');
            
            for (const item of pedido.itemsPedido) {
                await this.productoRepository.cancelarStock(item.producto.id, item.cantidad);
            }
        });
        
        await session.endSession();
        return pedidoActualizado;
    }

    /**
     * Cambia la cantidad de un item del pedido con validación de stock
     */
    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
        // Cambiar this.db.startSession() por mongoose.startSession()
        const session = await mongoose.startSession();
        let pedidoActualizado;
        
        await session.withTransaction(async () => {
            const pedido = await this.pedidoRepository.obtenerPedidoPorId(idPedido);
            const cantidadPrevia = pedido.obtenerCantidadItem(idItem);
            const diferencia = nuevaCantidad - cantidadPrevia;
            
            if (diferencia > 0) {
                await this.productoRepository.reservarStock(idItem, diferencia);
            } else if (diferencia < 0) {
                await this.productoRepository.cancelarStock(idItem, -diferencia);
            }
            
            pedido.modificarCantidadItem(idItem, nuevaCantidad);
            pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido.id, pedido);
        });
        
        await session.endSession();
        return pedidoActualizado;
    }

    obtenerPedidos() {
        return this.pedidoRepository.obtenerTodos();
    }
}