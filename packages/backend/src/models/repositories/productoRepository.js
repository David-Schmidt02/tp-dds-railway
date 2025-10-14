import { ProductoModel } from '../../schema/productoSchema.js';
import { ProductoInexistente, ProductoStockInsuficiente, ProductoNoDisponible, ProductoSinStock } from "../../excepciones/producto.js";

export class ProductoRepository {
    async cancelarStockProductos(itemsPedidos, usuario = null) {
        const mongoose = (await import('mongoose')).default;
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                for (const itemPedido of itemsPedidos) {
                    // Se asume que itemPedido tiene producto.id y cantidad
                    await this.cancelarStock(itemPedido.producto.id, itemPedido.cantidad, session);
                }
                // Aquí podrías guardar auditoría con el usuario si lo necesitas
            });
        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
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

    async reservarStockProductos(itemsPedidos, usuario = null) {
        const mongoose = (await import('mongoose')).default;
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                for (const itemPedido of itemsPedidos) {
                    // Se asume que itemPedido tiene producto.id y cantidad
                    await this.reservarStock(itemPedido.producto.id, itemPedido.cantidad, session);
                }
                // Aquí podrías guardar auditoría con el usuario si lo necesitas
            });
        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
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
                throw new ProductoNoDisponible(idProducto);
                }

                // Si llegamos aquí es porque no hay suficiente stock
                throw new ProductoStockInsuficiente(idProducto, producto.stock, cantidad);

            }

            return cantidad;
        } catch (error) {
            // Si es un error de casteo de ObjectId, significa que el ID es inválido
            if (error.name === 'CastError') {
                throw new ProductoInexistente(idProducto);
            }
            throw error;
            }
    }

    async obtenerPrecioUnitario(idProducto, session = null) {
        const producto = await this.obtenerProductoPorId(idProducto, session);
        return producto.precio;
    }

    async obtenerTodos(page, limit) {
        const skip = (page - 1) * limit;

        const totalItems = await ProductoModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const items = await ProductoModel
        .find({})
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

    
    async obtenerStockDisponible(idProducto, session = null) {
        try {
            let query = ProductoModel.findById(idProducto);

            if (session) {
                query = query.session(session);
            }

            const producto = await query;

            if (!producto) {
                throw new ProductoInexistente(idProducto);
            }
            return producto.stock;
        } catch (error) {
            // Si es un error de casteo de ObjectId, significa que el ID es inválido
            if (error.name === 'CastError') {
                throw new ProductoInexistente(idProducto);
            }
            throw error;
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