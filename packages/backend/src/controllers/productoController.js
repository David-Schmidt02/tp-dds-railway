import { productoToDTO } from '../dto/productoDTO.js';

export const producto = []

//Version con Service y Repository

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    async listarProductosVendedorConFiltros(req, res, next) {
        try {
            const { idVendedor } = req.params
            const {
                min,
                max,
                nombre,
                descripcion,
                categorias,
                page = 1,
                limit = 10,
                orden = "masVendido"
            } = req.query;

            if (!idVendedor){
                return res.status(400).json({ message: "Debe indicar el vendedor" });
            }

            const filters = {vendedor: idVendedor}; 
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

    async productosConFiltros(req, res, next) {
        try {
            const {
                min,
                max,
                nombre,
                descripcion,
                categorias,
                page = 1,
                limit = 10,
                orden = "masVendido",
                idVendedor,
                q
            } = req.query;


            const filters = {}
            if (idVendedor) filters.vendedor = idVendedor;
            if (min) filters.min = min;
            if (max) filters.max = max;

            if (q) {
                filters.q = q;
            } else {
                if (nombre) filters.titulo = nombre;
                if (descripcion) filters.descripcion = descripcion;
            }

            if (categorias) filters.categorias = categorias;

            if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            throw new Error("Los parámetros de paginación deben ser números positivos");
            }

            const resultado = await this.productoService.ProductosConFiltros(
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

    async obtenerProductoPorId(req, res, next) {
        try {
            const { id } = req.params;
            const producto = await this.productoService.obtenerProductoPorId(id);
            res.status(200).json(productoToDTO(producto));
        } catch (error) {
            next(error);
        }
    }

    async obtenerCategorias(req, res, next) {
        try {
            const categorias = await this.productoService.obtenerCategorias();
            res.status(200).json(categorias);
        } catch (error) {
            next(error);
        }
    }

}

export default ProductoController;
