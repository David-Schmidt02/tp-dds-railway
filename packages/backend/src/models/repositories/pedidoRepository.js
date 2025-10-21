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
import { pedidoToDoc, pedidoDocToDominio } from "../../dto/pedidoDTO.js";

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
           piso: direccion.piso,
            departamento: direccion.departamento,
            codigoPostal: direccion.codigoPostal,
            ciudad: direccion.ciudad
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

        // Reconstruir objeto Usuario (comprador) de dominio
        const comprador = new Usuario(usuarioData.nombre, usuarioData.email, usuarioData.telefono, usuarioData.tipoUsuario)

        // Reconstruir items de dominio (ItemPedido con Producto)
        const itemsPedido = pedidoDB.items?.map(item => {
            
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
                    productoData.activo 
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
                pedidoDB.direccionEntrega.numero || pedidoDB.direccionEntrega.altura,
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

        // Transformar el string de estado en el enum correspondiente
        switch (pedidoDB.estado) {
            case 'PENDIENTE':
                pedido.estado = EstadoPedido.PENDIENTE;
                break;
            case 'CONFIRMADO':
                pedido.estado = EstadoPedido.CONFIRMADO;
                break;
            case 'EN_PREPARACION':
                pedido.estado = EstadoPedido.EN_PREPARACION;
                break;
            case 'ENVIADO':
                pedido.estado = EstadoPedido.ENVIADO;
                break;
            case 'ENTREGADO':
                pedido.estado = EstadoPedido.ENTREGADO;
                break;
            case 'CANCELADO':
                pedido.estado = EstadoPedido.CANCELADO;
                break;
            default:
                pedido.estado = EstadoPedido.PENDIENTE;
        }
        pedido.fechaCreacion = pedidoDB.createdAt || pedidoDB.fechaPedido;
        pedido.fechaPedido = pedidoDB.fechaPedido;
        // Transformar historialEstados a instancias de CambioEstadoPedido
        pedido.historialEstados = (pedidoDB.historialEstados || []).map(hist => {
            // Estado anterior y nuevo pueden venir como string, convertir a enum
            let estadoAnterior = null;
            let nuevoEstado = null;
            switch (hist.estadoAnterior) {
                case 'PENDIENTE': estadoAnterior = EstadoPedido.PENDIENTE; break;
                case 'CONFIRMADO': estadoAnterior = EstadoPedido.CONFIRMADO; break;
                case 'EN_PREPARACION': estadoAnterior = EstadoPedido.EN_PREPARACION; break;
                case 'ENVIADO': estadoAnterior = EstadoPedido.ENVIADO; break;
                case 'ENTREGADO': estadoAnterior = EstadoPedido.ENTREGADO; break;
                case 'CANCELADO': estadoAnterior = EstadoPedido.CANCELADO; break;
                default: estadoAnterior = EstadoPedido.PENDIENTE;
            }
            switch (hist.nuevoEstado) {
                case 'PENDIENTE': nuevoEstado = EstadoPedido.PENDIENTE; break;
                case 'CONFIRMADO': nuevoEstado = EstadoPedido.CONFIRMADO; break;
                case 'EN_PREPARACION': nuevoEstado = EstadoPedido.EN_PREPARACION; break;
                case 'ENVIADO': nuevoEstado = EstadoPedido.ENVIADO; break;
                case 'ENTREGADO': nuevoEstado = EstadoPedido.ENTREGADO; break;
                case 'CANCELADO': nuevoEstado = EstadoPedido.CANCELADO; break;
                default: nuevoEstado = EstadoPedido.PENDIENTE;
            }
            // Reconstruir usuario si está presente
            let usuario = null;
            if (hist.usuario && typeof hist.usuario === 'object') {
                usuario = new Usuario(
                    hist.usuario.nombre,
                    hist.usuario.email,
                    hist.usuario.telefono,
                    hist.usuario.tipoUsuario
                );
                if (hist.usuario._id) {
                    usuario.id = hist.usuario._id.toString();
                }
            }
            // Instanciar CambioEstadoPedido y setear fecha si existe
            const cambio = new CambioEstadoPedido(
                estadoAnterior,
                nuevoEstado,
                pedido,
                usuario,
                hist.motivo
            );
            if (hist.fecha) {
                cambio.fecha = new Date(hist.fecha);
            }
            return cambio;
        });

        return pedido;
    }

    

    async guardarPedido(pedidoData) {
        try {
            const pedidoDoc = pedidoToDoc(pedidoData);
            const nuevoPedido = new PedidoModel(pedidoDoc);
            const resultado = await nuevoPedido.save();
            const pedidoCompleto = await this.model.findById(resultado._id)
                .populate('usuarioId')
                .populate({
                    path: 'items.productoId',
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

    async eliminarPedido(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }
        
        const resultado = await this.model.findByIdAndDelete(id);
        return resultado !== null;
    }
}




