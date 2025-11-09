import { usuarioDocToDominio } from "./usuarioDTO.js";
import { Producto } from "../models/entities/producto.js"
import { Usuario } from "../models/entities/usuario.js"

export function productoToDTO(producto) {
    return {
        id: producto._id,
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
            id: producto.vendedor._id?.toString() || producto.vendedor.id || producto.vendedor,
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

export function productoDocToDominio(productoDoc) {

    const producto = new Producto(
        productoDoc.id,
        usuarioDocToDominio(productoDoc.vendedor),
        productoDoc.titulo,
        productoDoc.descripcion,
        productoDoc.categorias,
        productoDoc.precio,
        productoDoc.moneda,
        productoDoc.stock,
        productoDoc.fotos,
        productoDoc.activo,
        productoDoc.vendidos,
    );
    return producto;
}

export function productoToDoc(producto) {
    const productoDoc = {
        id: producto.id,
        vendedor: producto.vendedor.id,
        titulo: producto.titulo,
        descripcion: producto.descripcion,
        categorias: producto.categorias,
        precio: producto.precio,
        moneda: producto.moneda,
        stock: producto.stock,
        fotos: producto.fotos,
        activo: producto.activo,
        vendidos: producto.vendidos
    }
    return productoDoc;
}
