export function pedidoToDTO(pedido) {
    const items = pedido.itemsPedido || pedido.items || [];

    return {
        id: pedido._id || pedido.id,
        comprador: {
            id: pedido.comprador?.id || pedido.usuarioId,
            nombre: pedido.comprador?.nombre,
            email: pedido.comprador?.email
        },
        items: items.map(item => ({
            producto: {
                id: item.producto?.id || item.productoId,
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
