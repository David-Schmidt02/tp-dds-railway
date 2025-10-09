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

    obtenerProducto(req, res) {
        const id = parseInt(req.params.id);
        try {
            // Mock de un producto específico
            const producto = { id: id, nombre: `Producto ${id}`, precio: id * 100 };
            return res.status(200).json(producto);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            return res.status(500).json({ error: 'Error al obtener el producto.' });
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
}

export default ProductoController;
