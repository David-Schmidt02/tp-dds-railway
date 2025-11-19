import { ItemPedido } from "../models/entities/itemPedido.js";
import {Pedido} from "../models/entities/pedido.js"
import {DireccionEntrega} from "../models/entities/direccionEntrega.js"
import {usuarioDocToDominio} from "./usuarioDTO.js"
import {productoDocToDominio} from "./productoDTO.js"
import { EstadoPedido } from "../models/entities/estadoPedido.js";


export function pedidoToDTO(pedido) {
    const items = pedido.itemsPedido || pedido.items || [];

    return {
        id: pedido._id,
        comprador: {
            id: pedido.comprador?._id || pedido.usuarioId,
            nombre: pedido.comprador?.nombre,
            email: pedido.comprador?.email
        },
        items: items.map(item => ({
            producto: {
                id: item.producto?._id || item.productoId,
                titulo: item.producto?.titulo,
                descripcion: item.producto?.descripcion,
                precio: item.producto?.precio || item.precioUnitario,
                categoria: item.producto?.categorias?.[0] || item.producto?.categoria
            },
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario || item.producto?.precio,
            subtotal: typeof item.subtotal === 'function'
                ? item.subtotal()
                : (item.subtotal || (item.cantidad * (item.precioUnitario || item.producto?.precio)))
        })),
        total: typeof pedido.calcularTotal === 'function'
            ? pedido.calcularTotal()
            : (pedido.total || 0),
        moneda: pedido.moneda || 'PESO_ARG',
        direccionEntrega: pedido.direccionEntrega || {},
        estado: typeof pedido.estado === 'string'
            ? pedido.estado
            : (pedido.estado?.nombre || 'PENDIENTE'),
        fechaCreacion: pedido.createdAt || pedido.fechaCreacion || new Date(),
        fechaActualizacion: pedido.updatedAt || pedido.fechaActualizacion || new Date()
    };
}

export function pedidoToDoc(pedido) {
    const pedidoDoc = {
        usuario: pedido.comprador.id,
        items: pedido.itemsPedido.map(item => ({
            producto: item.producto.id,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario
        })),
        direccionEntrega: {
            calle: pedido.direccionEntrega.calle,
            numero: pedido.direccionEntrega.altura,
            ciudad: pedido.direccionEntrega.ciudad,
            codigoPostal: pedido.direccionEntrega.codigoPostal
        },
        estado: pedido.estado.nombre,
        historialEstados: pedido.historialEstados.map(he => ({
            estadoAnterior: he.estadoAnterior?.nombre,
            estadoNuevo: he.nuevoEstado?.nombre,
            fecha: he.fecha || new Date(),
            motivo: he.motivo || undefined
        })),
        total: pedido.itemsPedido.reduce((sum, item) => sum + item.precioUnitario * item.cantidad, 0),
        fechaPedido: pedido.fechaCreacion || new Date()
    };

    return pedidoDoc;
}

export function pedidoDocToDominio(pedidoDoc) {
    const direccionEntrega = new DireccionEntrega(
        pedidoDoc.direccionEntrega.calle,
        pedidoDoc.direccionEntrega.numero,
        pedidoDoc.direccionEntrega.piso,
        pedidoDoc.direccionEntrega.departamento,
        pedidoDoc.direccionEntrega.codigoPostal,
        pedidoDoc.direccionEntrega.ciudad,
        pedidoDoc.direccionEntrega.calle
    )

    const comprador = usuarioDocToDominio(pedidoDoc.usuario);

    const itemsPedido = pedidoDoc.items.map(item => {
        const producto = productoDocToDominio(item.producto);
        return new ItemPedido(producto, item.cantidad, item.precioUnitario);
    });

    const estado = EstadoPedido[pedidoDoc.estado];

    const historial = (pedidoDoc.historialEstados || []).map(he => ({
        estadoAnterior: he.estadoAnterior ? EstadoPedido[he.estadoAnterior] : null,
        estadoNuevo: he.estadoNuevo ? EstadoPedido[he.estadoNuevo] : null,
        fecha: he.fecha ? new Date(he.fecha) : null,
        motivo: he.motivo || null
    }));

    const pedido = new Pedido(
        comprador,
        itemsPedido,
        'PESO_ARG',
        direccionEntrega,
        estado,
        pedidoDoc.fechaPedido,
        historial,
        pedidoDoc.id
    )
    
    return pedido;
}