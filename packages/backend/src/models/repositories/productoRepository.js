import { ProductoModel } from '../../schema/productoSchema.js';
import { ProductoInexistente, ProductoStockInsuficiente, ProductoNoDisponible, ProductoSinStock } from "../../excepciones/producto.js";

export class ProductoRepository {
   
    async obtenerProductoPorId(id, session = null) {
        try {
            let query = ProductoModel.findById(id);

            if (session) {
                query = query.session(session);
            }

            const producto = await query;

            if (!producto) {
                throw new ProductoInexistente(id);
            }
            return producto;
        } catch (error) {
            // Si es un error de casteo de ObjectId, significa que el ID es inválido
            if (error.name === 'CastError') {
                throw new ProductoInexistente(id);
            }
            throw error;
        }
    }

    async obtenerProductosOrdenados(page, limit, sortOp) {
        const skip = (page - 1) * limit;

        const totalItems = await ProductoModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        // Mongoose se encarga del ordenamiento directamente
        const items = await ProductoModel
            .find({})
            .sort(sortOp)
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

    async findByFilters(filters, page, limit, sort) {
        const skip = (page - 1) * limit;

        const totalItems = await ProductoModel.countDocuments(filters);
        const totalPages = Math.ceil(totalItems / limit);

        const items = await ProductoModel
        .find(filters)
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
}