import { ProductoModel } from '../schema/productoSchema.js';
import { ProductoInexistente, ProductoStockInsuficiente } from "../excepciones/producto.js";

export class ProductoRepository {
    constructor() {
        // No necesitas inicializar nada con Mongoose
    }

    async obtenerProductoPorId(id, session = null) {

        try {
            let query = ProductoModel.findById(id);

            if (session) {
                query = query.session(session);
                console.log('Session añadida a la query');
            }

            const producto = await query;

            if (!producto) {
                console.log('Producto no encontrado, lanzando excepción');
                throw new ProductoInexistente(id);
            }
            return producto;
        } catch (error) {
            console.log('Error en findById:', error.message);
            throw error;
        }
    }

   async reservarStock(idProducto, cantidad, session = null) {
    try {
        const result = await ProductoModel.findOneAndUpdate(
            {
                _id: idProducto,
                stock: { $gte: cantidad },
                activo: true
            },
            { $inc: { stock: -cantidad } },
            {
                new: true,
                runValidators: true,
                session
            }
        );

        if (!result) {
            // Buscar el producto para obtener información detallada
            let query = ProductoModel.findById(idProducto);
            if (session) {
                query = query.session(session);
            }
            const producto = await query;

            if (!producto) {
                throw new ProductoInexistente(idProducto);
            }

            // Verificar si el producto está activo
            if (!producto.activo) {
               throw new PrecioInvalido(idProducto);
            }

        }

        console.log(`Stock reservado exitosamente - ID: ${idProducto}, Cantidad: ${cantidad}, Stock restante: ${result.stock}`);
        return cantidad;
    } catch (error) {
        console.error('Error en reservarStock:', error);
        throw error;
    }
}
    async cancelarStock(idProducto, cantidad, session = null) {
        const result = await ProductoModel.findByIdAndUpdate(
            idProducto,
            { $inc: { stock: cantidad } },
            { new: true, session }
        );

        if (!result) {
            throw new ProductoInexistente(idProducto);
        }

        return cantidad;
    }

    async obtenerPrecioUnitario(idProducto, session = null) {
        const producto = await this.obtenerProductoPorId(idProducto, session);
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

      async obtenerProductosOrdenados(sortOption) {
        // Mongoose se encarga del ordenamiento directamente
        return await ProductoModel.find().sort(sortOption).exec();
      }

    async obtenerStockDisponible(idProducto, session = null) {
        let query = ProductoModel.findById(idProducto);
        
        if (session) {
            query = query.session(session);
        }
        
        const producto = await query;
        
        if (!producto) {
            throw new ProductoInexistente(idProducto);
        }
        return producto.stock;
    }

async findByFilters(filters, page, limit, sort) {
    const skip = (page - 1) * limit;

    const totalItems = await this.productoModel.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    const items = await this.productoModel
      .find(filters)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      page,
      limit,
      totalItems,
      totalPages,
      items
    }
  }
}