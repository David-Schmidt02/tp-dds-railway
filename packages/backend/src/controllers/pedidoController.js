import { Pedido } from '../dominio/pedido.js';
import { pedidoRequestSchema } from '../dominio/validaciones.js'; // Cambiar import
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';
import { PedidoInexistente, PedidoNoCancelable, PedidoNoModificable } from '../excepciones/pedido.js';
import { ProductoInexistente, ProductoStockInsuficiente } from '../excepciones/producto.js';
import { UsuarioInexistente } from '../excepciones/usuario.js';

export const pedidos = []


function pedidoToDTO(pedido) {
    console.log('Pedido recibido en DTO:', JSON.stringify(pedido, null, 2)); // Debug temporal
    
    return {
        id: pedido._id || pedido.id,
        comprador: {
            id: pedido.comprador?.id || pedido.usuarioId,
            nombre: pedido.comprador?.nombre || 'N/A',
            email: pedido.comprador?.email || 'N/A'
        },
        items: pedido.items?.map(item => ({
            producto: {
                id: item.producto?.id || item.productoId,
                titulo: item.producto?.titulo || 'N/A',
                descripcion: item.producto?.descripcion || 'N/A',
                precio: item.producto?.precio || item.precioUnitario,
                categoria: item.producto?.categoria || 'N/A'
            },
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario || item.producto?.precio,
            subtotal: item.subtotal || (item.cantidad * (item.precioUnitario || item.producto?.precio))
        })) || [],
        total: pedido.total || 0,
        moneda: pedido.moneda || 'PESO_ARG',
        direccionEntrega: pedido.direccionEntrega || {},
        estado: pedido.estado || { nombre: 'PENDIENTE', fecha: new Date() },
        fechaCreacion: pedido.createdAt || pedido.fechaCreacion || new Date(),
        fechaActualizacion: pedido.updatedAt || pedido.fechaActualizacion || new Date(),
        observaciones: pedido.comentarios || pedido.observaciones || ''
    };
}

//Versión con Service y Repository

export class PedidoController {
    constructor(pedidoService){
        this.pedidoService = pedidoService;
    }

    async crearPedido(req, res) {
        const body = req.body;
        
        const resultBody = pedidoRequestSchema.safeParse(body);
        console.log('Body recibido:', JSON.stringify(body, null, 2));
        
        if(resultBody.error){
            console.log('Errores de validación:', resultBody.error.errors);
            return res.status(400).json({ 
                error: 'Datos de entrada inválidos', 
                details: resultBody.error.errors 
            });
        }
        
        try {
            console.log('Llamando al service con:', JSON.stringify(resultBody.data, null, 2));
            
            const nuevoPedido = await this.pedidoService.crearPedido(resultBody.data);
            
            console.log('Respuesta del service:', nuevoPedido);
            console.log('Tipo de respuesta:', typeof nuevoPedido);
            console.log('¿Es null/undefined?:', nuevoPedido == null);
            
            if (!nuevoPedido) {
                throw new Error('El servicio no devolvió un pedido válido');
            }
            
            const pedidoDTO = pedidoToDTO(nuevoPedido);
            res.status(201).json(pedidoDTO);
            
        } catch(error) {
            console.error('Error al crear pedido:', error.message);
            console.error('Stack trace:', error.stack);

            if(error instanceof UsuarioInexistente) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    message: error.message
                });
            }

            if(error instanceof ProductoInexistente) {
                return res.status(422).json({
                    error: 'Producto no encontrado',
                    message: error.message
                });
            }

            if(error instanceof ProductoStockInsuficiente) {
                return res.status(409).json({
                    error: 'Stock insuficiente',
                    message: error.message
                });
            }

            return res.status(500).json({
                error: 'Error interno del servidor al crear el pedido',
                message: error.message
            });
        }
    }

    async obtenerPedidos(req, res) {
        try{
            const pedidos = await this.pedidoService.obtenerPedidos();
            return res.status(200).json(pedidos);
        }catch(error){
            return res.status(500).json({ error: 'Error al obtener los pedidos.' });
        }
    }

    async consultarHistorialPedido(req, res) {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ error: 'El parámetro usuarioId es requerido' });
        }

        try {
            const pedidos = await this.pedidoService.obtenerPedidosPorUsuario(usuarioId);
            const pedidosDTO = pedidos.map(pedidoToDTO);
            res.status(200).json(pedidosDTO);
        } catch(error) {
            console.error('Error al consultar historial de pedidos:', error.message);

            if(error instanceof UsuarioInexistente) {
                return res.status(404).json({
                    error: 'Usuario no encontrado',
                    message: error.message
                });
            }

            return res.status(500).json({
                error: 'Error interno del servidor al consultar el historial',
                message: error.message
            });
        }
    }
    
    async cancelarPedido(req, res) {
        const { id } = req.params;
        const { motivo } = req.body;
        const usuario = req.user; // Si usas autenticación, o lo obtienes del body

        try {
            const pedidoCancelado = await this.pedidoService.cancelarPedido(id, motivo, usuario);
            res.status(200).json(pedidoToDTO(pedidoCancelado));

        } catch(error) {
            console.error('Error al cancelar pedido:', error.message);

            if(error instanceof PedidoInexistente) {
                return res.status(404).json({
                    error: 'Pedido no encontrado',
                    message: error.message
                });
            }

            if(error instanceof PedidoNoCancelable) {
                return res.status(422).json({
                    error: 'Pedido no cancelable',
                    message: error.message
                });
            }

            return res.status(500).json({
                error: 'Error interno del servidor al cancelar el pedido',
                message: error.message
            });
        }
    }

    async cambiarCantidadItem(req, res) {
        const { idPedido, idItem } = req.params;
        const { cantidad: nuevaCantidad } = req.body;

        if (!nuevaCantidad || nuevaCantidad <= 0) {
            return res.status(400).json({
                error: 'La cantidad debe ser un número positivo'
            });
        }

        try {
            const pedidoActualizado = await this.pedidoService.cambiarCantidadItem(idPedido, idItem, nuevaCantidad);
            res.status(200).json(pedidoToDTO(pedidoActualizado));

        } catch (error) {
            console.error('Error al cambiar cantidad de item:', error.message);

            if(error instanceof PedidoInexistente) {
                return res.status(404).json({
                    error: 'Pedido no encontrado',
                    message: error.message
                });
            }

            if(error instanceof PedidoNoModificable) {
                return res.status(422).json({
                    error: 'Pedido no modificable',
                    message: error.message
                });
            }

            if(error instanceof ProductoStockInsuficiente) {
                return res.status(409).json({
                    error: 'Stock insuficiente para la nueva cantidad',
                    message: error.message
                });
            }

            return res.status(500).json({
                error: 'Error interno del servidor al modificar el item',
                message: error.message
            });
        }
    }
}

export default PedidoController;
