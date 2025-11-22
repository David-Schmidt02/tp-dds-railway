import { Notificacion } from "./notificacion.js";
import { Usuario } from "./usuario.js";

export let factoryNotificacionPedidos = {

    crearPedido(pedido) {
        const comprador = pedido.comprador.nombre;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const total = pedido.calcularTotal();
        const direccionEntrega = pedido.direccionEntrega;
        const vendedor = pedido.vendedor || pedido.itemsPedido[0]?.producto?.vendedor;

        const datosMensaje = {
            titulo: "Nuevo pedido recibido!",
            comprador: comprador,
            productos: productos,
            total: total,
            direccionEntrega: direccionEntrega,
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(vendedor.id, mensaje);
    },

    pedidoEnviado(pedido) {
        const comprador = pedido.comprador.nombre;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const total = pedido.calcularTotal();
        const direccionEntrega = pedido.direccionEntrega;
        const vendedor = pedido.vendedor || pedido.itemsPedido[0]?.producto?.vendedor;

        const datosMensaje = {
            titulo: "Pedido en camino!",
            comprador: comprador,
            productos: productos,
            total: total,
            direccionEntrega: direccionEntrega,
            vendedor: vendedor
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        // El receptor debe ser el id del comprador, no el objeto completo
        const receptorId = pedido.comprador?.id || pedido.comprador?._id;
        return new Notificacion(receptorId, mensaje);
    },

    cancelarPedido(pedido) {
        const comprador = pedido.comprador.nombre;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const total = pedido.calcularTotal();
        const direccionEntrega = pedido.direccionEntrega;
        const vendedor = pedido.vendedor || pedido.itemsPedido[0]?.producto?.vendedor;

        const datosMensaje = {
            titulo: "Pedido cancelado",
            idPedido: pedido.id,
            comprador: comprador,
            productos: productos,
            total: total,
            direccionEntrega: direccionEntrega,
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(vendedor.id, mensaje);
    },

   confirmarPedido(pedido) {
       const comprador = pedido.comprador;
       const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
       const estado = pedido.estado.nombre;
       const direccionEntrega = pedido.direccionEntrega;

       const datosMensaje = {
           titulo: "Tu pedido fue confirmado",
           productos: productos,
           estado: estado,
           direccionEntrega: direccionEntrega,
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        // El receptor debe ser el id del comprador, no el objeto completo
        const receptorId = comprador?.id || comprador?._id;
        return new Notificacion(receptorId, mensaje);
    }
};


function formatearMensajeNotificacion(datos) {
    const {
        titulo,
        comprador,
        productos,
        total,
        direccionEntrega,
        vendedor,
        pedidoId
    } = datos;

    const partes = [];

    if(titulo) partes.push(`${titulo} \n`);
    if(pedidoId) partes.push(`Pedido: ${pedidoId} \n`)
    if(comprador) partes.push(`Comprador: ${comprador} \n`);
    if(productos) partes.push(`Productos: ${productos} \n`);
    if(total) partes.push(`Total: ${total} \n`);
    if(direccionEntrega) {
        partes.push(`Direccion: ${direccionEntrega.calle}, ${direccionEntrega.altura}, ${direccionEntrega.ciudad} \n`);

        // Agregar piso y departamento si existen
        if(direccionEntrega.piso && direccionEntrega.departamento) {
            partes.push(`Piso: ${direccionEntrega.piso}, Departamento: ${direccionEntrega.departamento}`);
        } else if(direccionEntrega.piso) {
            partes.push(`Piso: ${direccionEntrega.piso}`);
        } else if(direccionEntrega.departamento) {
            partes.push(`Departamento: ${direccionEntrega.departamento}`);
        }
    }
    if(vendedor) partes.push(`Vendedor: ${vendedor} \n`);
    
    return partes.join('\n');
}