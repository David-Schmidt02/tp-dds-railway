import { pedidoRequestSchema } from '../models/entities/validaciones.js';
import { pedidoToDTO } from '../dto/pedidoDTO.js';

export const pedidos = []

//Versión con Service y Repository

export class PedidoController {
    constructor(pedidoService){
        this.pedidoService = pedidoService;
    }

    async crearPedido(req, res) {
        const body = req.body;

        const resultBody = pedidoRequestSchema.safeParse(body);

        if(resultBody.error){
            return res.status(400).json({
                message: 'Datos de entrada inválidos',
                details: resultBody.error.errors
            });
        }

        try {
            const nuevoPedido = await this.pedidoService.crearPedido(resultBody.data);

            if (!nuevoPedido) {
                throw new Error('El servicio no devolvió un pedido válido');
            }

            const pedidoDTO = pedidoToDTO(nuevoPedido);
            res.status(201).json(pedidoDTO);
            
        } catch(error) {
            console.error('Error al crear pedido:', error.message);
            return res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }

    async obtenerPedidos(req, res) {
        try{
            const pedidos = await this.pedidoService.obtenerPedidos();
            return res.status(200).json(pedidos);
        }catch(error){
            console.error('Error al obtener pedidos:', error.message);
            return res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }

    async consultarHistorialPedido(req, res) {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ message: 'El parámetro usuarioId es requerido' });
        }

        try {
            const pedidos = await this.pedidoService.obtenerPedidosPorUsuario(usuarioId);
            const pedidosDTO = pedidos.map(pedidoToDTO);
            res.status(200).json(pedidosDTO);
        } catch(error) {
            console.error('Error al consultar historial de pedidos:', error.message);
            return res.status(500).json({
                error: error.name || 'Error',
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
            return res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }

    async cambiarCantidadItem(req, res) {
        const { idPedido, idItem } = req.params;
        const { cantidad: nuevaCantidad } = req.body;

        if (!nuevaCantidad || nuevaCantidad <= 0) {
            return res.status(400).json({
                message: 'La cantidad debe ser un número positivo'
            });
        }

        try {
            const pedidoActualizado = await this.pedidoService.cambiarCantidadItem(idPedido, idItem, nuevaCantidad);
            res.status(200).json(pedidoToDTO(pedidoActualizado));

        } catch (error) {
            console.error('Error al cambiar cantidad de item:', error.message);
            return res.status(500).json({
                error: error.name || 'Error',
                message: error.message
            });
        }
    }
}

export default PedidoController;
