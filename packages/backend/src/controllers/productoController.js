import { Pedido } from '../dominio/pedido.js';
import { pedidoSchema } from '../dominio/validaciones.js';
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';

export const producto = []

//Version con Service y Repository

export class ProductoController {
    constructor(productoRepository) {
        this.productoRepository = productoRepository;
    }

    async obtenerProductos(req, res) {
        try {
            console.log('=== DEBUG GET /productos ===');
            const productos = await this.productoRepository.obtenerTodos();
            console.log('Productos devueltos:', productos.length);
            res.status(200).json(productos);
        } catch (error) {
            console.error('Error en GET productos:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async obtenerProductosOrdenados(req, res) {
        try {
          const { orden = 'precioAsc' } = req.query;
          const resultado = await this.productoRepository.obtenerProductosOrdenados(orden);
          res.status(200).json(resultado);
        } catch (error) {
          console.error('Error en obtenerProductosOrdenados:', error);
          res.status(500).json({ mensaje: 'Error al obtener los productos ordenados' });
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
                return res.status(400).json({ error: "Debe indicar el vendedor" });
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
            res.status(500).json({ mensaje: "Error al listar productos del vendedor" });
        }
        
    }
}

export default ProductoController;
