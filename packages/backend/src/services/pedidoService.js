// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../models/entities/pedido.js';
import { ItemPedido } from '../models/entities/itemPedido.js';
import { Producto } from '../models/entities/producto.js';
import { DireccionEntrega } from '../models/entities/direccionEntrega.js';
import { PedidoRepository } from '../models/repositories/pedidoRepository.js';
import { PedidoInexistente } from '../excepciones/pedido.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import { factoryNotificacionPedidos } from '../models/entities/FactoryNotificacion.js';
import mongoose from 'mongoose';

export class PedidoService {
    constructor(pedidoRepository, productoRepository, notificacionRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.notificacionRepository = notificacionRepository;
    }

    async crearPedido(pedidoJSON) {
        const { usuarioId, items, metodoPago, direccionEntrega, comentarios } = pedidoJSON;
        const session = await mongoose.startSession();

        let pedidoGuardado;

        try {
            await session.withTransaction(async () => {
                const itemsPedidos = [];

                // PASO 1: VALIDAR EXISTENCIA Y STOCK DISPONIBLE ANTES DE RESERVAR
                for (const itemData of items) {
                    const { productoId, cantidad } = itemData;

                    // Validar que el producto existe y obtener stock disponible
                    const producto = await this.productoRepository.obtenerProductoPorId(productoId, session);
                    await this.productoRepository.obtenerStockDisponible(productoId, session);
                }

                // PASO 2: SI TODO EL STOCK ESTÁ DISPONIBLE, RESERVAR ATÓMICAMENTE Y CREAR ITEMS DE DOMINIO
                for (const itemData of items) {
                    const { productoId, cantidad } = itemData;

                    const producto = await this.productoRepository.obtenerProductoPorId(productoId, session);
                    await this.productoRepository.reservarStock(productoId, cantidad, session);
                    const precioUnitario = await this.productoRepository.obtenerPrecioUnitario(productoId, session);

                    // Crear ItemPedido de dominio
                    const itemPedido = new ItemPedido(producto, cantidad, precioUnitario);
                    itemsPedidos.push(itemPedido);
                }

                // PASO 3: OBTENER COMPRADOR (Usuario de dominio)
                // TODO: Implementar usuarioRepository.obtenerUsuarioPorId()
                // Por ahora creamos un objeto simple con el ID
                const comprador = { id: usuarioId };

                // PASO 4: CREAR DIRECCIÓN DE ENTREGA DE DOMINIO
                const direccion = new DireccionEntrega(
                    direccionEntrega.calle,
                    direccionEntrega.numero,
                    direccionEntrega.piso,
                    direccionEntrega.departamento,
                    direccionEntrega.codigoPostal
                );
                direccion.ciudad = direccionEntrega.ciudad;
                direccion.provincia = direccionEntrega.provincia;
                direccion.referencia = direccionEntrega.referencia;

                // PASO 5: CREAR OBJETO PEDIDO DE DOMINIO
                // Constructor: (comprador, items, moneda, direccionEntrega, id)
                const pedidoNuevo = new Pedido(
                    comprador,
                    itemsPedidos,
                    metodoPago, // La moneda
                    direccion,
                    null // ID se asigna al guardar
                );

                // Guardar el pedido (aPedidoDB transformará a formato DB)
                pedidoGuardado = await this.pedidoRepository.guardarPedido(pedidoNuevo, session);
            });
            
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
            
        } catch (error) {
            console.error('Error al crear pedido:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }
        
        return pedidoGuardado;
    }

   
    async cancelarPedido(id, motivo, usuario) {
        const session = await mongoose.startSession();
        let pedidoActualizado;
        
        try {
            await session.withTransaction(async () => {
                const pedido = await this.pedidoRepository.obtenerPedidoPorId(id, session);

                // Validar que se puede cancelar
                if (pedido.estado.nombre === 'ENVIADO' || pedido.estado.nombre === 'ENTREGADO') {
                    throw new PedidoYaEntregado(id)
                }
                
                pedidoActualizado = await this.pedidoRepository.actualizarEstadoPedido(pedido.id, 'CANCELADO', session);
                
                // Devolver stock de todos los items
                for (const item of pedido.itemsPedido) {
                    await this.productoRepository.cancelarStock(item.producto.id, item.cantidad, session);
                }
            });
            
            // Crear notificación de cancelación fuera de la transacción
            try {
                const notificacion = factoryNotificacionPedidos.cancelarPedido(
                    pedidoActualizado,
                    motivo,
                    'comprador'
                );
                if (notificacion) {
                    await this.notificacionRepository.agregarNotificacion(
                        notificacion.receptor.id,
                        notificacion
                    );
                }
            } catch (notificacionError) {
                console.warn('Error al crear notificación de cancelación:', notificacionError.message);
            }
            
        } catch (error) {
            console.error('Error al cancelar pedido:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }
        
        return pedidoActualizado;
    }

    /**
     * Cambia la cantidad de un item del pedido con validación de stock
     */
    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
        const session = await mongoose.startSession();
        let pedidoActualizado;
        
        try {
            await session.withTransaction(async () => {
                const pedido = await this.pedidoRepository.obtenerPedidoPorId(idPedido, session);

                const cantidadPrevia = pedido.obtenerCantidadItem(idItem);
                const diferencia = nuevaCantidad - cantidadPrevia;

                if (diferencia > 0) {
                    // Necesitamos más stock - reservar (el repository valida stock disponible)
                    await this.productoRepository.reservarStock(idItem, diferencia, session);
                } else if (diferencia < 0) {
                    // Liberamos stock
                    await this.productoRepository.cancelarStock(idItem, Math.abs(diferencia), session);
                }
                
                pedido.modificarCantidadItem(idItem, nuevaCantidad);
                pedidoActualizado = await this.pedidoRepository.guardarPedidoModificado(pedido, session);
            });
        } catch (error) {
            console.error('Error al cambiar cantidad de item:', error.message);
            throw error;
        } finally {
            await session.endSession();
        }
        
        return pedidoActualizado;
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
        return await this.pedidoRepository.obtenerPedidosPorUsuario(usuarioId);
    }
}