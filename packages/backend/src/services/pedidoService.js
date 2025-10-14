// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../models/entities/pedido.js';
import { ItemPedido } from '../models/entities/itemPedido.js';
import { Producto } from '../models/entities/producto.js';
import { DireccionEntrega } from '../models/entities/direccionEntrega.js';
import { PedidoRepository } from '../models/repositories/pedidoRepository.js';
import { PedidoInexistente } from '../excepciones/pedido.js';
import { ProductoInexistente, ProductoStockInsuficiente, ProductoNoDisponible } from '../excepciones/producto.js';
import { factoryNotificacionPedidos } from '../models/entities/FactoryNotificacion.js';
import mongoose from 'mongoose';

export class PedidoService {
    constructor(pedidoRepository, productoRepository, notificacionRepository, usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async crearPedido(pedidoJSON) {

        const { usuarioId, items, moneda, direccionEntrega, comentarios } = pedidoJSON;
        let pedidoGuardado;
        
        // transformar items JSON a objetos de dominio
        const itemsPedidos = [];

        for (const itemData of items) {
            let { productoId, cantidad } = itemData;
            const producto = await this.productoRepository.obtenerProductoPorId(productoId);
            if (!producto) {
                throw new ProductoInexistente(`El producto con ID ${productoId} no existe.`);
            }
            cantidad = parseInt(cantidad); // No validamos porque supuestamente si ya llegó la propuesta de crear pedido es porque hay stock suficiente, igualmente saltaría sino en reservaStock
            const precioUnitario = await this.productoRepository.obtenerPrecioUnitario(productoId);
            
            const itemPedido = new ItemPedido(producto, cantidad, precioUnitario);
            itemsPedidos.push(itemPedido);
        }

        const comprador = await  this.usuarioRepository.obtenerUsuarioPorId(usuarioId);

        const direccion = new DireccionEntrega(
            direccionEntrega.calle,
            direccionEntrega.altura || direccionEntrega.numero, // Aceptar ambos nombres
            direccionEntrega.piso,
            direccionEntrega.departamento,
            direccionEntrega.codigoPostal,
            direccionEntrega.ciudad,
            direccionEntrega.referencia
        );

        console.log('Dirección de entrega:', direccion);
        const pedidoNuevo = new Pedido(
            comprador,
            itemsPedidos,
            moneda, // La moneda(Ya validada)
            direccion,
            null // ID se asigna al guardar
        );

        try {
            await this.productoRepository.reservarStockProductos(itemsPedidos);
        } catch (error) {
            if (error instanceof ProductoNoDisponible) {
                throw error;
            }
            if (error instanceof ProductoStockInsuficiente) {
                throw error;
            }
            throw new Error('Error al reservar stock: ' + error.message);
        }

        // Guardar el pedido (aPedidoDB transformará a formato DB)
        try {
            pedidoGuardado = await this.pedidoRepository.guardarPedido(pedidoNuevo);
        } catch (error) {
            // Si ocurre un error al guardar, liberar el stock reservado
            await this.productoRepository.cancelarStockProductos(itemsPedidos);
            throw error;
        }

        try {
            const notificacion = factoryNotificacionPedidos.crearPedido(pedidoGuardado);
            if (notificacion && notificacion.receptor) {
                await this.notificacionRepository.agregarNotificacion(
                    notificacion.receptor.id,
                    notificacion
                );
            }
        } catch (notificacionError) {
            console.error('Error al crear notificación:', notificacionError);
        }
        return pedidoGuardado;
    }

   
    async cancelarPedido(id, motivo, usuario) {
        const session = await mongoose.startSession();
        let pedidoActualizado;
        let pedido;

        try {
            await session.withTransaction(async () => {
                pedido = await this.pedidoRepository.obtenerPedidoPorId(id);
                pedido.actualizarEstado('CANCELADO', usuario, motivo);

                // Devolver stock de todos los items (debe aceptar session)
                await this.productoRepository.cancelarStockProductos(pedido.itemsPedido, session);

                pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido, session);
            });
        } catch (error) {
            console.error('Error al cancelar pedido:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }

        // Crear notificación de cancelación fuera de la transacción
        try {
            const notificacion = factoryNotificacionPedidos.cancelarPedido(pedidoActualizado);
            if (notificacion) {
                await this.notificacionRepository.agregarNotificacion(
                    notificacion.receptor.id,
                    notificacion
                );
            }
        } catch (notificacionError) {
            console.warn('Error al crear notificación de cancelación:', notificacionError.message);
        }

        return pedidoActualizado;
    }

    /**
     * Cambia la cantidad de un item del pedido con validación de stock
     */
    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
        const session = await mongoose.startSession();
        let resultado;

        try {
            await session.withTransaction(async () => {
                // El repository valida la lógica de negocio y retorna el pedido actualizado + diferencia
                resultado = await this.pedidoRepository.cambiarCantidadItem(idPedido, idItem, nuevaCantidad, session);

                // Ajustar stock según la diferencia
                const diferencia = resultado.diferenciaCantidad;

                if (diferencia > 0) {
                    // Necesitamos más stock - reservar (el repository valida stock disponible)
                    await this.productoRepository.reservarStock(idItem, diferencia, session);
                } else if (diferencia < 0) {
                    // Liberamos stock
                    await this.productoRepository.cancelarStock(idItem, Math.abs(diferencia), session);
                }
            });
        } catch (error) {
            console.error('Error al cambiar cantidad de item:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }

        return resultado.pedido;
    }

    async obtenerPedidos() {
        const session = await mongoose.startSession();
        try {
            return await this.pedidoRepository.obtenerPedidos(session);
        } catch (error) {
            console.error('Error al obtener pedidos:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async obtenerPedidosPorUsuario(usuarioId) {
        // Validar que el usuario existe
        await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);

        return await this.pedidoRepository.obtenerPedidosPorUsuario(usuarioId);
    }
}