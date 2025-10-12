import mongoose from "mongoose";
import { PedidoInexistente, EstadoPedidoInvalido, PedidoYaCancelado, PedidoYaEntregado, PedidoNoCancelable, PedidoNoModificable } from "../../excepciones/pedido.js";
import { UsuarioInexistente } from "../../excepciones/usuario.js";
import { PedidoModel } from "../../schema/pedidoSchema.js";
import { Pedido } from "../entities/pedido.js";
import { ItemPedido } from "../entities/itemPedido.js";
import { Usuario } from "../entities/usuario.js";
import { Producto } from "../entities/producto.js";
import { DireccionEntrega } from "../entities/direccionEntrega.js";
import { Moneda } from "../entities/moneda.js";

export class PedidoRepository {
    constructor() {
        this.model = PedidoModel;
    }

    // Transformación de dominio a formato de DB
    aPedidoDB(pedido) {
        // Manejar items: pueden ser array de ItemPedido (dominio) o array de plain objects
        const items = pedido.itemsPedido || pedido.items || [];
        const itemsDB = items.map(item => ({
            productoId: item.producto?.id || item.productoId,
            cantidad: item.cantidad,
            precioUnitario: typeof item.precioUnitario === 'number'
                ? item.precioUnitario
                : (item.precioUnitario?.valor || 0)
        }));

        // Manejar dirección de entrega (puede ser objeto DireccionEntrega de dominio o plain object)
        const direccion = pedido.direccionEntrega || {};
        const direccionDB = {
            calle: direccion.calle,
            numero: direccion.altura || direccion.numero, // DireccionEntrega usa 'altura', el JSON usa 'numero'
            ciudad: direccion.ciudad,
            codigoPostal: direccion.codigoPostal,
            provincia: direccion.provincia,
            referencia: direccion.referencia
        };

        // Calcular total: si es objeto de dominio, llamar al método; si no, usar el valor
        let total = 0;
        if (typeof pedido.calcularTotal === 'function') {
            total = pedido.calcularTotal();
        } else if (typeof pedido.total === 'number') {
            total = pedido.total;
        } else if (pedido.total?.valor) {
            total = pedido.total.valor;
        }

        return {
            numero: pedido.numero,
            usuarioId: pedido.comprador?.id || pedido.usuarioId,
            items: itemsDB,
            direccionEntrega: direccionDB,
            estado: typeof pedido.estado === 'string'
                ? pedido.estado
                : (pedido.estado?.nombre || 'PENDIENTE'),
            historialEstados: pedido.historialEstados || [],
            total: total,
            fechaPedido: pedido.fechaPedido || new Date()
        };
    }

    // Transformación de formato DB a dominio
    dePedidoDB(pedidoDB) {
        if (!pedidoDB) return null;

        // Reconstruir objeto Usuario (comprador) de dominio
        const usuarioData = typeof pedidoDB.usuarioId === 'object' ? pedidoDB.usuarioId : null;
        const comprador = usuarioData
            ? new Usuario(usuarioData.nombre, usuarioData.email, usuarioData.telefono, usuarioData.tipoUsuario)
            : null;

        // Asignar ID al comprador si existe
        if (comprador && usuarioData._id) {
            comprador.id = usuarioData._id.toString();
        }

        // Reconstruir items de dominio (ItemPedido con Producto)
        const itemsPedido = pedidoDB.items?.map(item => {
            const productoData = typeof item.productoId === 'object' ? item.productoId : null;

            let producto = null;
            if (productoData) {
                // Reconstruir vendedor del producto si está disponible
                const vendedorData = typeof productoData.vendedor === 'object' ? productoData.vendedor : null;
                const vendedor = vendedorData
                    ? new Usuario(vendedorData.nombre, vendedorData.email, vendedorData.telefono, vendedorData.tipoUsuario)
                    : null;

                if (vendedor && vendedorData._id) {
                    vendedor.id = vendedorData._id.toString();
                }

                producto = new Producto(
                    vendedor,
                    productoData.titulo,
                    productoData.descripcion,
                    productoData.categorias || [],
                    productoData.precio,
                    productoData.moneda || Moneda.PESO_ARG,
                    productoData.stock || 0,
                    productoData.fotos || [],
                    productoData.activo !== false
                );
                producto.id = productoData._id.toString();
            }

            const precioUnitario = typeof item.precioUnitario === 'number'
                ? item.precioUnitario
                : (item.precioUnitario?.valor || 0);

            return new ItemPedido(producto, item.cantidad, precioUnitario);
        }) || [];

        // Reconstruir DireccionEntrega de dominio
        const direccionEntrega = pedidoDB.direccionEntrega
            ? new DireccionEntrega(
                pedidoDB.direccionEntrega.calle,
                pedidoDB.direccionEntrega.numero,
                pedidoDB.direccionEntrega.piso,
                pedidoDB.direccionEntrega.departamento,
                pedidoDB.direccionEntrega.codigoPostal
            )
            : null;

        // Asignar campos adicionales a la dirección
        if (direccionEntrega) {
            direccionEntrega.ciudad = pedidoDB.direccionEntrega.ciudad;
            direccionEntrega.provincia = pedidoDB.direccionEntrega.provincia;
            direccionEntrega.referencia = pedidoDB.direccionEntrega.referencia;
        }

        // Crear objeto Pedido de dominio
        // Constructor: (comprador, items, moneda, direccionEntrega, id = null)
        const pedido = new Pedido(
            comprador,
            itemsPedido,
            Moneda.PESO_ARG, // Moneda por defecto
            direccionEntrega,
            pedidoDB._id?.toString()
        );

        // Asignar propiedades adicionales que no están en el constructor
        pedido.numero = pedidoDB.numero;
        pedido.estado = pedidoDB.estado; // El estado será un string del enum
        pedido.fechaCreacion = pedidoDB.createdAt || pedidoDB.fechaPedido;
        pedido.fechaPedido = pedidoDB.fechaPedido;
        pedido.historialEstados = pedidoDB.historialEstados || [];

        return pedido;
    }

    async guardarPedido(pedidoData, session = null) {
        try {
            const pedidoDB = this.aPedidoDB(pedidoData);  // Convierte a formato de DB
            const nuevoPedido = new this.model(pedidoDB); // Usa el modelo de Mongoose

            let resultado;
            if (session) {
                resultado = await nuevoPedido.save({ session });
            } else {
                resultado = await nuevoPedido.save();
            }

            const pedidoCompleto = await this.model.findById(resultado._id)
                .populate('usuarioId')
                .populate({
                    path: 'items.productoId',
                    populate: { path: 'vendedor' }
                })
                .session(session);

            return this.dePedidoDB(pedidoCompleto.toObject());
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
            .populate('usuarioId') // popula el usuario, es decir trae toda la info del usuario sabiendo que el usuarioId es una referencia a otro documento
            .populate('items.productoId');
        
        if (!pedido) {
            throw new PedidoInexistente(id);
        }
        
        return this.dePedidoDB(pedido.toObject());
    }

    async obtenerPedidos(session = null) {
        let query = this.model.find();
        if (session) {
            query = query.session(session);
        }
        const pedidos = await query
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
            .populate('usuarioId')
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

    /**
     * Guarda un objeto de dominio Pedido modificado en la base de datos
     * Usado cuando se modifican propiedades del pedido (items, cantidades, etc.)
     */
    async guardarPedidoModificado(pedidoDominio, session = null) {
        if (!mongoose.Types.ObjectId.isValid(pedidoDominio.id)) {
            throw new PedidoInexistente(pedidoDominio.id);
        }

        // Transformar el objeto de dominio a formato DB
        const pedidoDB = this.aPedidoDB(pedidoDominio);

        // Actualizar el documento
        const opciones = session ? { session, new: true } : { new: true };
        const resultado = await this.model.findByIdAndUpdate(
            pedidoDominio.id,
            pedidoDB,
            opciones
        );

        if (!resultado) {
            throw new PedidoInexistente(pedidoDominio.id);
        }

        // Populate y devolver objeto de dominio
        const pedidoCompleto = await this.model.findById(resultado._id)
            .populate('usuarioId')
            .populate('items.productoId')
            .session(session);

        return this.dePedidoDB(pedidoCompleto.toObject());
    }

    /**
     * Cambia la cantidad de un item del pedido con validación de negocio
     * Retorna el pedido actualizado y la diferencia de cantidad (para ajustar stock)
     */
    async cambiarCantidadItem(idPedido, idItem, nuevaCantidad, session = null) {
        if (!mongoose.Types.ObjectId.isValid(idPedido)) {
            throw new PedidoInexistente(idPedido);
        }

        // Obtener pedido con populate para convertir a dominio
        let query = this.model.findById(idPedido)
            .populate('usuarioId')
            .populate('items.productoId');

        if (session) {
            query = query.session(session);
        }

        const pedidoDB = await query;
        if (!pedidoDB) {
            throw new PedidoInexistente(idPedido);
        }

        // Convertir a objeto de dominio para validar
        const pedido = this.dePedidoDB(pedidoDB.toObject());

        // Obtener cantidad previa antes de modificar
        const cantidadPrevia = pedido.obtenerCantidadItem(idItem);
        if (cantidadPrevia === null) {
            throw new Error('Producto no encontrado en el pedido');
        }

        // Validar lógica de negocio (lanza PedidoNoModificable si no se puede)
        pedido.modificarCantidadItem(idItem, nuevaCantidad);

        // Guardar cambios
        const pedidoActualizado = await this.guardarPedidoModificado(pedido, session);

        // Retornar pedido actualizado y diferencia para que el service ajuste stock
        return {
            pedido: pedidoActualizado,
            diferenciaCantidad: nuevaCantidad - cantidadPrevia
        };
    }

    /**
     * Actualiza el estado de un pedido y registra el cambio en el historial
     */
    async actualizarEstadoPedido(id, nuevoEstado, usuario, motivo) {
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

    /**
     * Cancela un pedido con validación de negocio
     */
    async cancelarPedido(id, session = null) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new PedidoInexistente(id);
        }

        let query = this.model.findById(id);
        if (session) {
            query = query.session(session);
        }

        const pedidoDB = await query;
        if (!pedidoDB) {
            throw new PedidoInexistente(id);
        }

        // Convertir a objeto de dominio para validar
        const pedido = this.dePedidoDB(pedidoDB.toObject());

        // Validar lógica de negocio
        if (!pedido.puedeCancelarse()) {
            throw new PedidoNoCancelable(pedido.estado);
        }

        // Si pasa la validación, actualizar estado
        pedidoDB.estado = 'CANCELADO';
        pedidoDB.historialEstados.push({
            estadoAnterior: pedido.estado,
            estadoNuevo: 'CANCELADO',
            fecha: new Date()
        });

        const resultado = await pedidoDB.save({ session });

        // Populate y retornar objeto de dominio
        const pedidoCompleto = await this.model.findById(resultado._id)
            .populate('usuarioId')
            .populate({
                path: 'items.productoId',
                populate: { path: 'vendedor' }
            })
            .session(session);

        return this.dePedidoDB(pedidoCompleto.toObject());
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




