import mongoose from "mongoose";
import { PedidoInexistente } from "../../excepciones/pedido.js";
import { UsuarioInexistente } from "../../excepciones/usuario.js";
import { PedidoModel } from "../../schema/pedidoSchema.js";

import { pedidoToDoc, pedidoDocToDominio } from "../../dto/pedidoDTO.js";

export class PedidoRepository {
    constructor(productoRepository) {
        this.model = PedidoModel;
        this.productoRepository = productoRepository;
    }

    async guardarPedido(pedidoData) {
        try {
            const pedidoDoc = pedidoToDoc(pedidoData);
            const nuevoPedido = new PedidoModel(pedidoDoc);

            const resultado = await nuevoPedido.save();

            for (const item of pedidoData.getItems()) {
                await this.productoRepository.guardarProducto(item.getProducto());
            }

            const pedidoCompleto = await this.model.findById(resultado._id)
                .populate('usuario')
                .populate({
                    path: 'items.producto',
                    populate: { path: 'vendedor' }
                });

            return pedidoDocToDominio(pedidoCompleto);

        } catch (error) {
            // Si es un error de validación de Mongoose que incluye CastError para usuarioId
            if (error.name === 'ValidationError' && error.errors?.usuarioId?.name === 'CastError') {
                throw new UsuarioInexistente(pedidoData.comprador?.id || pedidoData.usuarioId);
            }
            throw error;
        }
    }

    async obtenerPedidoPorId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new PedidoInexistente(id);
        }
        
        const pedido = await this.model.findById(id)
            .populate('usuario') // popula el usuario, es decir trae toda la info del usuario sabiendo que el usuario es una referencia a otro documento
            .populate({path: 'items.producto',
                populate: {
                    path: 'vendedor',
                    model: 'Usuario'
                }
            });
        
        if (!pedido) {
            throw new PedidoInexistente(id);
        }
        
        return pedidoDocToDominio(pedido);
    }

    async obtenerPedidos() {
        let query = this.model.find();
        const pedidos = await query
            .populate('usuario')
            .populate('items.producto')
            .sort({ fechaPedido: -1 });
        return pedidos.map(pedido => pedidoDocToDominio(pedido));
    }

    async obtenerPedidosPorUsuario(usuarioId) {
        const pedidos = await this.model.find({ usuarioId })
            .populate('usuario')
            .populate('items.producto')
            .sort({ fechaPedido: -1 });

        return pedidos.map(pedido => pedidoDocToDominio(pedido));
    }

    async obtenerPedidosPorEstado(estado) {
        const pedidos = await this.model.find({ estado })
            .populate('usuario')
            .populate('items.producto')
            .sort({ fechaPedido: -1 });

        return pedidos.map(pedido => pedidoDocToDominio(pedido));
    }

    /**
     * Guarda un objeto de dominio Pedido modificado en la base de datos
     * Usado cuando se modifican propiedades del pedido (items, cantidades, etc.)
     */
    async guardarPedidoModificado(pedidoDominio) {
        if (!mongoose.Types.ObjectId.isValid(pedidoDominio.id)) {
            throw new PedidoInexistente(pedidoDominio.id);
        }

        const pedidoDB = pedidoToDoc(pedidoDominio);

        const resultado = await this.model.findByIdAndUpdate(
            pedidoDominio.id,
            pedidoDB,
        );

        for (const item of pedidoDominio.getItems()) {
             await this.productoRepository.guardarProducto(item.getProducto());
        }

        const pedidoCompleto = await this.model.findById(resultado._id)
                .populate('usuario')
                .populate({
                    path: 'items.producto',
                    populate: { path: 'vendedor' }
                });

        return pedidoDocToDominio(pedidoCompleto);
    }

    async eliminarPedido(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }
        
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }
}




