import { productoToDTO } from '../dto/productoDTO.js';

export const producto = []

//Version con Service y Repository

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    async obtenerProductos(req, res, next) {
        try {
            const {
                page = 1,
                limit = 10,
            } = req.query;
            const resultado = await this.productoService.obtenerProductos(parseInt(page), parseInt(limit));
            res.status(200).json({
                ...resultado,
                items: resultado.items.map(productoToDTO)
            });
        } catch (error) {
            next(error);
        }
    }

    async obtenerProductosOrdenados(req, res, next) {
        try {
          const {
                page = 1,
                limit = 10,
                orden
            } = req.query;
          const resultado = await this.productoService.obtenerProductosOrdenados(parseInt(page), parseInt(limit), orden);
          res.status(200).json({
                ...resultado,
                items: resultado.items.map(productoToDTO)
            });
        } catch (error) {
          next(error);
        }
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

            if (min && max) {
                filters.precio = { $gte: parseFloat(min), $lte: parseFloat(max) };
            } else if (min) {
                filters.precio = { $gte: parseFloat(min) };
            } else if (max) {
                filters.precio = { $lte: parseFloat(max) };
            }

            if (nombre) {
                filters.titulo = new RegExp(nombre.trim(), "i");
            }

            if (descripcion) {
                filters.descripcion = new RegExp(descripcion.trim(), "i");
            }

            if (categorias) {
                const categoriasArray = typeof categorias === "string"
                ? categorias.split(",")
                : categorias;
                //suponiendo que se requieren todas las categorias
                filters.categorias = { $all: categoriasArray };
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
