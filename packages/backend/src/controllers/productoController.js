import { productosToDTO } from '../dto/productoDTO.js';

export const producto = []

//Version con Service y Repository

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    async obtenerProductos(req, res) {
        try {
            const productos = await this.productoService.obtenerProductos();
            res.status(200).json(productosToDTO(productos));
        } catch (error) {
            console.error('Error en GET productos:', error);
            res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }

    async obtenerProductosOrdenados(req, res) {
        try {
          const { orden = 'precioAsc' } = req.query;
          const resultado = await this.productoService.obtenerProductosOrdenados(orden);
          res.status(200).json(productosToDTO(resultado));
        } catch (error) {
          console.error('Error en obtenerProductosOrdenados:', error);
          res.status(500).json({
              error: error.name || 'Error',
              message: error.message
          });
        }
      }

    async listarProductosVendedorConFiltros(req, res) {
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
                filters.nombre = new RegExp(nombre.trim(), "i");
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

            const result = await this.productoService.listarProductosVendedorConFiltros(
                filters,
                parseInt(page),
                parseInt(limit),
                orden
            );

            res.status(200).json(result);
        }catch(error){
            console.error('Error al listar productos del vendedor:', error);
            res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }

    }
}

export default ProductoController;
