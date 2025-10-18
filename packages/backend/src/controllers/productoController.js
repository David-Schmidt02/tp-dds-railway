import { productoToDTO } from '../dto/productoDTO.js';

export const producto = []

//Version con Service y Repository

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    async listarProductosVendedorConFiltros(req, res, next) {
        try {
            const {
                vendedorId,
                min,
                max,
                nombre,
                descripcion,
                categorias,
                page = 1,
                limit = 10,
                orden
            } = req.query;

            if (!vendedorId){
                return res.status(400).json({ message: "Debe indicar el vendedor" });
            }

            const filters = {vendedor: vendedorId}; 
            if (min) filters.min = min;
            if (max) filters.max = max;
            if (nombre) filters.titulo = nombre;
            if (descripcion) filters.descripcion = descripcion;
            if (categorias) filters.categorias = categorias;

            if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            throw new Error("Los parámetros de paginación deben ser números positivos");
            }

            const resultado = await this.productoService.listarProductosVendedorConFiltros(
                filters,
                parseInt(page),
                parseInt(limit),
                orden
            );

            res.status(200).json({
                ...resultado,
                items: resultado.items.map(productoToDTO)
            });
        }catch(error){
            next(error);
        }

    }
}

export default ProductoController;
