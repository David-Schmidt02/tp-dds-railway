import mongoose from "mongoose";
import { PedidoInexistente } from "../excepciones/notificaciones.js";
import { Pedido, PedidoModel } from "../schema/pedidoSchema.js";

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    // Transformación de dominio a formato de DB
    aPedidoDB(pedido) {
        return {
            numero: pedido.numero,
            usuarioId: pedido.usuarioId,
            items: pedido.items?.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad,
                precioUnitario: {
                    valor: item.precioUnitario?.valor || 0,
                    moneda: item.precioUnitario?.moneda || 'ARS'
                },
                subtotal: {
                    valor: item.subtotal?.valor || 0,
                    moneda: item.subtotal?.moneda || 'ARS'
                }
            })) || [],
            direccionEntrega: {
                calle: pedido.direccionEntrega?.calle,
                numero: pedido.direccionEntrega?.numero,
                ciudad: pedido.direccionEntrega?.ciudad,
                codigoPostal: pedido.direccionEntrega?.codigoPostal,
                provincia: pedido.direccionEntrega?.provincia,
                referencia: pedido.direccionEntrega?.referencia
            },
            estado: pedido.estado || 'PENDIENTE',
            historialEstados: pedido.historialEstados || [],
            total: {
                valor: pedido.total?.valor || 0,
                moneda: pedido.total?.moneda || 'ARS'
            },
            fechaPedido: pedido.fechaPedido || new Date(),
            fechaEntregaEstimada: pedido.fechaEntregaEstimada,
            observaciones: pedido.observaciones
        };
    }

    // Transformación de formato DB a dominio
    dePedidoDB(pedidoDB) {
        if (!pedidoDB) return null;
        
        return {
            id: pedidoDB._id?.toString(),
            numero: pedidoDB.numero,
            usuarioId: pedidoDB.usuarioId,
            items: pedidoDB.items?.map(item => ({
                id: item._id?.toString(),
                productoId: item.productoId,
                cantidad: item.cantidad,
                precioUnitario: {
                    valor: item.precioUnitario?.valor,
                    moneda: item.precioUnitario?.moneda
                },
                subtotal: {
                    valor: item.subtotal?.valor,
                    moneda: item.subtotal?.moneda
                }
            })) || [],
            direccionEntrega: {
                calle: pedidoDB.direccionEntrega?.calle,
                numero: pedidoDB.direccionEntrega?.numero,
                ciudad: pedidoDB.direccionEntrega?.ciudad,
                codigoPostal: pedidoDB.direccionEntrega?.codigoPostal,
                provincia: pedidoDB.direccionEntrega?.provincia,
                referencia: pedidoDB.direccionEntrega?.referencia
            },
            estado: pedidoDB.estado,
            historialEstados: pedidoDB.historialEstados?.map(cambio => ({
                estadoAnterior: cambio.estadoAnterior,
                estadoNuevo: cambio.estadoNuevo,
                fecha: cambio.fecha,
                motivo: cambio.motivo
            })) || [],
            total: {
                valor: pedidoDB.total?.valor,
                moneda: pedidoDB.total?.moneda
            },
            fechaPedido: pedidoDB.fechaPedido,
            fechaEntregaEstimada: pedidoDB.fechaEntregaEstimada,
            observaciones: pedidoDB.observaciones,
            fechaCreacion: pedidoDB.createdAt,
            fechaActualizacion: pedidoDB.updatedAt
        };
    }

    async crearPedido(pedidoData) {
        const pedidoDB = this.aPedidoDB(pedidoData);  // Convierte a formato de DB
        const nuevoPedido = new this.model(pedidoDB); // Usa el modelo de Mongoose
        const resultado = await nuevoPedido.save();   // Guarda en la base de datos
        return this.dePedidoDB(resultado.toObject());
    }

    async obtenerPedidoPorId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new PedidoInexistente(id);
        }
        
        const pedido = await this.model.findById(id)
            .populate('usuarioId') // popula el usuario, es decir trae toda la info del usuario sabiendo que el usuarioId es una referencia a otro documento
            .populate('items.productoId');
        
        if (!pedido) {
            throw new PedidoInexistente(id);
        }
        
        return this.dePedidoDB(pedido.toObject());
    }

    async obtenerTodosLosPedidos() {
        const pedidos = await this.model.find()
            .populate('usuarioId')
            .populate('items.productoId')
            .sort({ fechaPedido: -1 });
        
        return pedidos.map(pedido => this.dePedidoDB(pedido.toObject()));
    }

    async obtenerPedidosPorUsuario(usuarioId) {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return [];
        }
        
        const pedidos = await this.model.find({ usuarioId })
            .populate('items.productoId')
            .sort({ fechaPedido: -1 });
        
        return pedidos.map(pedido => this.dePedidoDB(pedido.toObject()));
    }

    async obtenerPedidosPorEstado(estado) {
        const pedidos = await this.model.find({ estado })
            .populate('usuarioId')
            .populate('items.productoId')
            .sort({ fechaPedido: -1 });
        
        return pedidos.map(pedido => this.dePedidoDB(pedido.toObject()));
    }

    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad) {
        if (!mongoose.Types.ObjectId.isValid(idPedido)) {
            throw new PedidoInexistente(idPedido);
        }
        
        const pedido = await this.model.findById(idPedido);
        if (!pedido) {
            throw new PedidoInexistente(idPedido);
        }
        
        const item = pedido.items.id(idItem);
        if (!item) {
            throw new Error('Item no encontrado en el pedido');
        }
        
        item.cantidad = nuevaCantidad;
        item.subtotal.valor = item.precioUnitario.valor * nuevaCantidad;
        
        // Recalcular total del pedido
        const nuevoTotal = pedido.items.reduce((suma, item) => suma + item.subtotal.valor, 0);
        pedido.total.valor = nuevoTotal;
        
        const resultado = await pedido.save();
        return this.dePedidoDB(resultado.toObject());
    }

    async actualizarPedido(id, nuevoEstado, usuario, motivo) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new PedidoInexistente(id);
        }
        
        const pedido = await this.model.findById(id);
        if (!pedido) {
            throw new PedidoInexistente(id);
        }
        
        const estadoAnterior = pedido.estado;
        
        // Agregar cambio al historial
        pedido.historialEstados.push({
            estadoAnterior,
            estadoNuevo: nuevoEstado,
            fecha: new Date(),
            motivo
        });
        
        pedido.estado = nuevoEstado;
        
        const resultado = await pedido.save();
        return this.dePedidoDB(resultado.toObject());
    }

    async obtenerPrecioUnitario(id, productoId) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new PedidoInexistente(id);
        }
        
        const pedido = await this.model.findById(id);
        if (!pedido) {
            throw new PedidoInexistente(id);
        }
        
        const item = pedido.items.find(item => 
            item.productoId.toString() === productoId.toString()
        );
        
        return item ? {
            valor: item.precioUnitario.valor,
            moneda: item.precioUnitario.moneda
        } : null;
    }

    async eliminarPedido(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }
        
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }
}




