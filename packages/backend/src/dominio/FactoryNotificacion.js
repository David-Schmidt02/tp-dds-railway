import { Notificacion } from "./notificacion.js";
import { Usuario } from "./usuario.js";

/**
 * Formatea mensajes de notificación con estructura consistente
 */
function formatearMensajeNotificacion(datos) {
    let mensaje = `**${datos.titulo}**\n\n`;
    
    Object.keys(datos).forEach(key => {
        if (key !== 'titulo' && key !== 'adicional' && datos[key]) {
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            mensaje += `• **${label}:** ${datos[key]}\n`;
        }
    });
    
    if (datos.adicional) {
        mensaje += `\n${datos.adicional}`;
    }
    
    return mensaje;
}

export const FactoryNotificacionPedidos = {

    /**
     * Notificación cuando se crea un nuevo pedido
     */
    crearPedido(pedido) {
        const comprador = pedido.comprador.nombre;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const total = pedido.calcularTotal();
        const direccionEntrega = pedido.direccionEntrega;
        const vendedor = pedido.vendedor || pedido.itemsPedido[0]?.producto?.vendedor;

        const datosMensaje = {
            titulo: "🛒 Nuevo pedido recibido",
            comprador: comprador,
            productos: productos,
            total: `$${total.toLocaleString()}`,
            direccionEntrega: direccionEntrega,
            cantidadItems: pedido.itemsPedido.length,
            adicional: "¡Procesa este pedido lo antes posible!"
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(vendedor, mensaje);
    },

    /**
     * Notificación cuando se confirma/aprueba un pedido
     */
    confirmarPedido(pedido) {
        const comprador = pedido.comprador;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const fechaEstimada = pedido.fechaEntregaEstimada || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        const datosMensaje = {
            titulo: "✅ Tu pedido fue confirmado",
            productos: productos,
            fechaEntrega: fechaEstimada.toLocaleDateString(),
            estado: "Confirmado - En preparación",
            direccionEntrega: pedido.direccionEntrega,
            adicional: "¡Pronto tendrás tus productos!"
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(comprador, mensaje);
    },

    /**
     * Notificación cuando se envía el pedido
     */
    enviarPedido(pedido, numeroSeguimiento = null) {
        const comprador = pedido.comprador;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const fechaEntrega = pedido.fechaEntregaEstimada || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        const datosMensaje = {
            titulo: "🚚 ¡Tu pedido está en camino!",
            productos: productos,
            fechaEntregaEstimada: fechaEntrega.toLocaleDateString(),
            direccionEntrega: pedido.direccionEntrega,
            numeroSeguimiento: numeroSeguimiento || "Se enviará por separado",
            adicional: "¡Ya casi llega a tu domicilio!"
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(comprador, mensaje);
    },

    /**
     * Notificación cuando se cancela un pedido
     */
    cancelarPedido(pedido, motivo = 'No especificado', canceladoPor = 'sistema') {
        const comprador = pedido.comprador;
        const vendedor = pedido.vendedor || pedido.itemsPedido[0]?.producto?.vendedor;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        
        // Determinar receptor según quién canceló
        const receptor = canceladoPor === 'comprador' ? vendedor : comprador;
        const tituloCancelacion = canceladoPor === 'comprador' 
            ? "❌ Pedido cancelado por el cliente"
            : "❌ Pedido cancelado";

        const datosMensaje = {
            titulo: tituloCancelacion,
            comprador: comprador.nombre,
            productos: productos,
            motivo: motivo,
            fechaCancelacion: new Date().toLocaleDateString(),
            adicional: canceladoPor === 'comprador' 
                ? "El stock ha sido liberado automáticamente."
                : "Te reembolsaremos según nuestros términos y condiciones."
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(receptor, mensaje);
    },

    /**
     * Notificación cuando un pedido es rechazado por el vendedor
     */
    rechazarPedido(pedido, motivo = 'Stock no disponible') {
        const comprador = pedido.comprador;
        const vendedor = pedido.vendedor || pedido.itemsPedido[0]?.producto?.vendedor;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');

        const datosMensaje = {
            titulo: "❌ Pedido rechazado por el vendedor",
            vendedor: vendedor.nombre,
            productos: productos,
            motivo: motivo,
            fechaRechazo: new Date().toLocaleDateString(),
            adicional: "Podrás realizar un nuevo pedido cuando el stock esté disponible."
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(comprador, mensaje);
    },

    /**
     * Notificación de recordatorio de entrega
     */
    recordarEntrega(pedido) {
        const comprador = pedido.comprador;
        const productos = pedido.itemsPedido.map(item => item.producto.titulo).join(', ');
        const fechaEntrega = pedido.fechaEntregaEstimada || new Date();

        const datosMensaje = {
            titulo: "📦 Recordatorio de entrega",
            productos: productos,
            fechaEntrega: fechaEntrega.toLocaleDateString(),
            direccionEntrega: pedido.direccionEntrega,
            horarioEntrega: "9:00 AM - 6:00 PM",
            adicional: "¡Prepárate para recibir tu pedido!"
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(comprador, mensaje);
    },

    /**
     * Notificación de stock bajo para vendedores
     */
    stockBajo(producto, vendedor, stockActual = 0) {
        const datosMensaje = {
            titulo: "⚠️ Stock bajo detectado",
            producto: producto.titulo || producto.nombre,
            stockActual: `${stockActual} unidades`,
            stockMinimo: `${producto.stockMinimo || 5} unidades`,
            categoria: producto.categoria || 'Sin categoría',
            adicional: "Considera reabastecer este producto pronto para evitar pérdida de ventas."
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(vendedor, mensaje);
    },

    /**
     * Notificación de producto agotado
     */
    productoAgotado(producto, vendedor) {
        const datosMensaje = {
            titulo: "🚫 Producto agotado",
            producto: producto.titulo || producto.nombre,
            categoria: producto.categoria || 'Sin categoría',
            fechaAgotamiento: new Date().toLocaleDateString(),
            adicional: "Este producto no estará disponible hasta que repongas el stock."
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(vendedor, mensaje);
    },

    /**
     * Notificación de nuevo usuario registrado
     */
    nuevoUsuario(usuario, esVendedor = false) {
        const tipoUsuario = esVendedor ? 'vendedor' : 'comprador';
        
        const datosMensaje = {
            titulo: "👋 ¡Bienvenido a nuestra plataforma!",
            usuario: usuario.nombre,
            email: usuario.email,
            tipoUsuario: tipoUsuario,
            fechaRegistro: new Date().toLocaleDateString(),
            adicional: esVendedor 
                ? "¡Ya puedes comenzar a vender tus productos!"
                : "¡Explora nuestros productos y realiza tu primer pedido!"
        };

        const mensaje = formatearMensajeNotificacion(datosMensaje);

        return new Notificacion(usuario, mensaje);
    }
};

// Exportar también como default para compatibilidad
export default FactoryNotificacionPedidos;