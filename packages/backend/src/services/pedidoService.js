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

        const { usuarioId, items, moneda, direccionEntrega } = pedidoJSON;
        let pedidoGuardado;
        
        // transformar items JSON a objetos de dominio
        const itemsPedidos = await Promise.all(items.map(async (itemData) => {
            let { productoId, cantidad } = itemData;
            const producto = await this.productoRepository.obtenerProductoPorId(productoId);
            cantidad = parseInt(cantidad);
            const precioUnitario = producto.precioUnitario;
        }));

        const comprador = await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);

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

        try {    // no se bien como atajar esto
            const reservado = pedido.reservarItems(); //capaz estaria bueno q se haga en el constructor
        } catch (error) {
            if (error instanceof ProductoNoDisponible) {
            throw error;
            }
            if (error instanceof ProductoStockInsuficiente) {
            throw error;
            }
            throw new Error('Error al reservar stock: ' + error.message);
        }

        this.guardarEstadoDeItems(itemsPedido); //TODO que dentro deberia de tener guardar estado del producto, donde se haga el productModel.save()


        // Guardar el pedido (aPedidoDB transformará a formato DB)
        pedidoGuardado = await this.pedidoRepository.guardarPedido(pedidoNuevo);

        try {
            const notificacion = factoryNotificacionPedidos.crearPedido(pedidoGuardado);
            if (notificacion && notificacion.receptor) {
                notificacion.usuarioId = notificacion.receptor.id;
                await this.notificacionRepository.guardarNotificacion(notificacion);
            }
        } catch (notificacionError) {
            console.error('Error al crear notificación:', notificacionError);
        }
        return pedidoGuardado;
    }

   
    async cancelarPedido(id, motivo, usuario) {
        let pedidoActualizado;
        let pedido;

        pedido = await this.pedidoRepository.obtenerPedidoPorId(id);
        pedido.actualizarEstado('CANCELADO', usuario, motivo);

        pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido);

        // Crear notificación de cancelación fuera de la transacción
        try {
            const notificacion = factoryNotificacionPedidos.cancelarPedido(pedidoActualizado);
            if (notificacion) {
                notificacion.usuarioId = notificacion.receptor.id;
                await this.notificacionRepository.guardarNotificacion(notificacion);
            }
        } catch (notificacionError) {
            console.warn('Error al crear notificación de cancelación:', notificacionError.message);
        }

        return pedidoActualizado;
    }

    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
        const session = await mongoose.startSession();
        let pedidoActualizado;
        try {
            const pedido = await this.pedidoRepository.obtenerPedidoPorId(idPedido);

            const diferenciaCantidad = pedido.cambiarCantidadItem(idItem, nuevaCantidad);

            pedidoActualizado = await this.pedidoRepository.actualizarPedido(pedido);
        } catch (error) {
            console.error('Error al cambiar cantidad de item:', error.message);
            throw error;
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
        // Validar que el usuario existe
        await this.usuarioRepository.obtenerUsuarioPorId(usuarioId);

        return await this.pedidoRepository.obtenerPedidosPorUsuario(usuarioId);
    }
}