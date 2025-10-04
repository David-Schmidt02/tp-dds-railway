import { Pedido } from '../dominio/pedido.js';
import { pedidoSchema } from '../dominio/validaciones.js';
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';

export const producto = []

//Version con Service y Repository

export class ProductoController {
    constructor(productoService) {
        this.productoService = productoService;
    }

    obtenerProductos(req, res) {
        try {
            // Por ahora devolvemos productos mock
            const productos = [
                { id: 1, nombre: "Producto 1", precio: 100 },
                { id: 2, nombre: "Producto 2", precio: 200 },
                { id: 3, nombre: "Producto 3", precio: 300 }
            ];
            return res.status(200).json(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ error: 'Error al obtener los productos.' });
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
}

export default ProductoController;
