import { productoDocToDominio, productoToDoc } from '../../dto/productoDTO.js';
import { ProductoModel } from '../../schema/productoSchema.js';
import { ProductoInexistente, ProductoStockInsuficiente, ProductoNoDisponible, ProductoSinStock } from "../../excepciones/producto.js";

export class ProductoRepository {

    async obtenerProductoPorId(id) {
        const productoDoc = await ProductoModel.findById(id).populate('vendedor');
        if(!productoDoc) {
            throw new ProductoInexistente(id);
        }
        const producto = productoDocToDominio(productoDoc);
        return producto;
    }

    async guardarProducto(producto) {
        const data = productoToDoc(producto);
        if(producto.id) {
            const productoDoc = await ProductoModel.findById(producto.id)
            productoDoc.set(data);
            return await productoDoc.save()
        } else { // caso de que sea un producto nuevo, no deberia usarse nunca por ahora
            const nuevoProducto = new ProductoModel(data);
            return await nuevoProducto.save();
        }

    }

    async findByFilters(filters, page, limit, orden) {
        const skip = (page - 1) * limit;
        let sort;
        const mongoFilters = {};

        // Manejo de filtro por vendedor(es)
        if (filters.vendedor) {
            // Si es un array, usar $in para filtrar por múltiples vendedores
            if (Array.isArray(filters.vendedor)) {
                mongoFilters.vendedor = { $in: filters.vendedor };
            } else {
                mongoFilters.vendedor = filters.vendedor;
            }
        }

        if (filters.min && filters.max) {
            mongoFilters.precio = { $gte: parseFloat(filters.min), $lte: parseFloat(filters.max) };
        } else if (filters.min) {
            mongoFilters.precio = { $gte: parseFloat(filters.min) };
        } else if (filters.max) {
            mongoFilters.precio = { $lte: parseFloat(filters.max) };
        }

        if (filters.q) {
            const searchRegex = new RegExp(filters.q.trim(), "i");
            mongoFilters.$or = [
                { titulo: searchRegex },
                { descripcion: searchRegex }
            ];
        } else {
            if (filters.titulo) {
                mongoFilters.titulo = new RegExp(filters.titulo.trim(), "i");
            }
            if (filters.descripcion) {
                mongoFilters.descripcion = new RegExp(filters.descripcion.trim(), "i");
            }
        }

        if (filters.categorias) {
            mongoFilters.categorias = { $in: filters.categorias };
        }

        const totalItems = await ProductoModel.countDocuments(mongoFilters);
        const totalPages = Math.ceil(totalItems / limit);
        
        switch (orden) {
            case "precioAsc":
                sort = { precio: 1 };
                break;
            case "precioDesc":
                sort = { precio: -1 };
                break;
            case "masVendido":
                sort = { vendidos: -1 };
                break;
            default:
                sort = { createdAt: -1 };
        }

        const items = await ProductoModel
        .find(mongoFilters)
        .populate('vendedor')
        .sort(sort)
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

    async obtenerCategoriasUnicas() {
        const categorias = await ProductoModel.aggregate([
            { $unwind: '$categorias' },
            { $group: { _id: '$categorias' } },
            { $sort: { _id: 1 } }
        ]);
        return categorias.map(cat => cat._id);
    }
}