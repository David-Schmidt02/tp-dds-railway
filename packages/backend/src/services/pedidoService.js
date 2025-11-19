import { Pedido } from '../models/entities/pedido.js';
import { EstadoPedido, estadoPedidoFromString } from '../models/entities/estadoPedido.js'
import { ItemPedido } from '../models/entities/itemPedido.js';
import { Producto } from '../models/entities/producto.js';
import { DireccionEntrega } from '../models/entities/direccionEntrega.js';
import { PedidoRepository } from '../models/repositories/pedidoRepository.js';
import { PedidoInexistente, EstadoPedidoInvalido } from '../excepciones/pedido.js';
import { ProductoInexistente, ProductoStockInsuficiente, ProductoNoDisponible } from '../excepciones/producto.js';
import { factoryNotificacionPedidos } from '../models/entities/FactoryNotificacion.js';
import mongoose from 'mongoose';
import { usuarioDocToDominio } from '../dto/usuarioDTO.js';

export class PedidoService {
    constructor(pedidoRepository, productoRepository, notificacionRepository, usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async crearPedido(pedidoJSON) {
        let pedidoNuevo = {}
        const { usuarioId, items, moneda, direccionEntrega } = pedidoJSON;
    
        const itemsPedidos = await Promise.all(items.map(async (itemData) => {
            let { productoId, cantidad } = itemData;
            const producto = await this.productoRepository.obtenerProductoPorId(productoId);

            const precioUnitario = producto.precio || 100;
            return new ItemPedido(producto, parseInt(cantidad), precioUnitario);
        }));

        const compradorDoc = await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);
        const comprador = usuarioDocToDominio(compradorDoc);

        const direccion = new DireccionEntrega(
            direccionEntrega.calle,
            direccionEntrega.numero,
            direccionEntrega.piso,
            direccionEntrega.departamento,
            direccionEntrega.codigoPostal,
            direccionEntrega.ciudad,
            direccionEntrega.referencia
        );

        try { 
            pedidoNuevo = new Pedido(
                comprador,
                itemsPedidos,
                moneda,
                direccion
            );

            pedidoNuevo.reservarItems(); 
                 
        } catch (error) {
            if (error instanceof ProductoNoDisponible) throw error;
            if (error instanceof ProductoStockInsuficiente) throw error;
            throw new Error('Error al reservar stock: ' + error.message);
        }

        // Guardar el pedido (el repository usa pedidoToDoc del DTO para transformar a formato DB)
        let pedidoGuardado = await this.pedidoRepository.guardarPedido(pedidoNuevo);

        try {
            const notificacion = factoryNotificacionPedidos.crearPedido(pedidoGuardado);
            if (notificacion) {
                await this.notificacionRepository.saveNotificacionNueva(notificacion);
            }
        } catch (notificacionError) {
            console.error('Error al crear notificación:', notificacionError);
        }
        return pedidoGuardado;
    }

   
    async cancelarPedido(pedidoId, motivo, usuarioId) {
        let pedidoActualizado;
        let pedido;

        try { 
            pedido = await this.pedidoRepository.obtenerPedidoPorId(pedidoId);
            const usuario = await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);
            pedido.actualizarEstado(EstadoPedido.CANCELADO, usuario, motivo);
            
            pedidoActualizado = await this.pedidoRepository.guardarPedidoModificado(pedido);
    
        } catch (error) {
            if (error instanceof ProductoNoDisponible) throw error;
            if (error instanceof EstadoPedidoInvalido) throw error;
            throw new Error('Error al renovar stock por cancelacion de pedido: ' + error.message);
        } 

        // Crear notificación de cancelación fuera de la transacción
        try {
            const notificacion = factoryNotificacionPedidos.cancelarPedido(pedidoActualizado);
            await this.notificacionRepository.saveNotificacionNueva(notificacion);
        } catch (notificacionError) {
            console.warn('Error al crear notificación de cancelación:', notificacionError.message);
        }

        return pedidoActualizado;
    }

    async cambiarCantidadItem(idPedido, idProducto, nuevaCantidad) {
        let pedido;
        try {
            pedido = await this.pedidoRepository.obtenerPedidoPorId(idPedido);

            const item = pedido.modificarCantidadItem(idProducto, nuevaCantidad);

            await this.pedidoRepository.guardarPedidoModificado(pedido);

        } catch (error) {
            console.error('Error al cambiar cantidad de item:', error.message);
            throw error;
        }
        return pedido;
    }

    async obtenerPedidos() {
        try {
            return await this.pedidoRepository.obtenerPedidos();
        } catch (error) {
            throw error;
        }
    }

    async obtenerPedidosPorUsuario(usuarioId) {
        // Validar que el usuario existe
        await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);

        return await this.pedidoRepository.obtenerPedidosPorUsuario(usuarioId);
    }
}