import { ProductoModel } from '../schema/productoSchema.js';
import { ProductoInexistente, ProductoStockInsuficiente } from "../excepciones/producto.js";

export class ProductoRepository {
    constructor() {
        // No necesitas inicializar nada con Mongoose
    }

    async obtenerProductoPorId(id) {
        console.log('=== DEBUG ProductoRepository ===');
        console.log('ID buscado:', id);
        console.log('Tipo de ID:', typeof id);
        console.log('Longitud del ID:', id.length);
        
        try {
            const producto = await ProductoModel.findById(id);
            console.log('Resultado de findById:', producto);
            console.log('¿Es null?:', producto === null);
            
            if (!producto) {
                console.log('Producto no encontrado, lanzando excepción');
                throw new ProductoInexistente(id);
            }
            
            console.log('Producto encontrado exitosamente');
            return producto;
        } catch (error) {
            console.log('Error en findById:', error.message);
            throw error;
        }
    }

    async reservarStock(idProducto, cantidad) {
        const result = await ProductoModel.findOneAndUpdate(
            { 
                _id: idProducto,
                stock: { $gte: cantidad },
                activo: true
            },
            { $inc: { stock: -cantidad } },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!result) {
            const producto = await ProductoModel.findById(idProducto);
            if (!producto) {
                throw new ProductoInexistente(idProducto);
            }
            throw new ProductoStockInsuficiente(idProducto);
        }

        return cantidad;
    }

    async cancelarStock(idProducto, cantidad) {
        const result = await ProductoModel.findByIdAndUpdate(
            idProducto,
            { $inc: { stock: cantidad } },
            { new: true }
        );

        if (!result) {
            throw new ProductoInexistente(idProducto);
        }

        return cantidad;
    }

    async obtenerPrecioUnitario(idProducto) {
        const producto = await this.obtenerProductoPorId(idProducto);
        return producto.precio;
    }

    async obtenerTodos() {
        console.log('=== DEBUG obtenerTodos ===');
        console.log('Colección de ProductoModel:', ProductoModel.collection.name);
        
        // Buscar TODOS los productos sin filtro
        const todosLosProductos = await ProductoModel.find({});
        console.log('TODOS los productos encontrados:', todosLosProductos.length);
        console.log('IDs de todos los productos:', todosLosProductos.map(p => ({
            id: p._id.toString(),
            titulo: p.titulo || p.nombre, // Por si acaso tiene 'nombre' en lugar de 'titulo'
            activo: p.activo || p.disponible // Por si acaso tiene 'disponible' en lugar de 'activo'
        })));
        
        return todosLosProductos;
    }
}