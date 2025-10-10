// El Service se va a encargar de orquestar las clases de negocio + el órden de las operaciones
// El Service no debería tener lógica de negocio, solo orquestación

import { Pedido } from '../dominio/pedido.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Producto } from '../dominio/producto.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';
import { PedidoRepository } from '../repositories/pedidoRepository.js';
import { PedidoInexistente } from '../excepciones/pedido.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import { factoryNotificacionPedidos } from '../dominio/FactoryNotificacion.js';
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

                    console.log('=== DEBUG PEDIDO SERVICE ===');
                    console.log('ItemData completo:', JSON.stringify(itemData, null, 2));
                    console.log('ProductoId extraído:', productoId);
                    console.log('Tipo de productoId:', typeof productoId);
                    console.log('Cantidad:', cantidad);

                    // Validar que el producto existe
                    const producto = await this.productoRepository.obtenerProductoPorId(productoId, session);
                    if (!producto) {
                        throw new ProductoInexistente(`Producto ${productoId} no encontrado`);
                    }

                    // Validar stock disponible ANTES de reservar
                    const stockDisponible = await this.productoRepository.obtenerStockDisponible(productoId, session);
                    if (stockDisponible < cantidad) {
                        throw new ProductoStockInsuficiente(
                            `Stock insuficiente para ${producto.titulo}. Disponible: ${stockDisponible}, Solicitado: ${cantidad}`
                        );
                    }
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
            
            // PASO 4: CREAR NOTIFICACIÓN FUERA DE LA TRANSACCIÓN PRINCIPAL
            try {
                // Crear notificación usando el factory
                const notificacion = FactoryNotificacionPedidos.crearPedido(pedidoGuardado, session);
                if (notificacion && notificacion.receptor) {
                    await this.notificacionRepository.agregarNotificacion(
                        notificacion.receptor.id,
                        notificacion
                    );
                }
            } catch (notificacionError) {
                console.warn('Error al crear notificación:', notificacionError.message);
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
                if (!pedido) {
                    throw new PedidoInexistente(`Pedido ${id} no encontrado`);
                }
                
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
                const notificacion = FactoryNotificacionPedidos.cancelarPedido(
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
                if (!pedido) {
                    throw new PedidoInexistente(`Pedido ${idPedido} no encontrado`);
                }
                
                const cantidadPrevia = pedido.obtenerCantidadItem(idItem);
                const diferencia = nuevaCantidad - cantidadPrevia;
                
                if (diferencia > 0) {
                    // Necesitamos más stock - validar disponibilidad primero
                    const stockDisponible = await this.productoRepository.obtenerStockDisponible(idItem, session);
                    if (stockDisponible < diferencia) {
                        throw new ProductoStockInsuficiente(
                            `Stock insuficiente. Disponible: ${stockDisponible}, Solicitado: ${diferencia}`
                        );
                    }
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