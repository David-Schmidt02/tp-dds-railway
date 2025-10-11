export function productoToDTO(producto) {
    return {
        id: producto._id || producto.id,
        titulo: producto.titulo,
        descripcion: producto.descripcion,
        precio: producto.precio,
        moneda: producto.moneda || 'PESO_ARG',
        stock: producto.stock,
        vendidos: producto.vendidos || 0,
        categorias: producto.categorias || [],
        fotos: producto.fotos || [],
        activo: producto.activo !== false,
        vendedor: producto.vendedor ? {
            id: producto.vendedor._id || producto.vendedor.id || producto.vendedor,
            nombre: producto.vendedor.nombre,
            email: producto.vendedor.email
        } : null,
        fechaCreacion: producto.createdAt || producto.fechaCreacion || new Date(),
        fechaActualizacion: producto.updatedAt || producto.fechaActualizacion || new Date()
    };
}

export function productosToDTO(productos) {
    return productos.map(productoToDTO);
}
