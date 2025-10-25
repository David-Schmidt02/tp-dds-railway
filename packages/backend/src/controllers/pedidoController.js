import { pedidoSchema } from '../models/entities/validaciones.js';
import { pedidoToDTO } from '../dto/pedidoDTO.js';

export const pedidos = []

//Versión con Service y Repository

export class PedidoController {
    constructor(pedidoService){
        this.pedidoService = pedidoService;
    }

    async crearPedido(req, res, next) {
        const body = pedidoSchema.safeParse(req.body);
        
        if(body.error){
            return res.status(400).json({
                message: 'Datos de entrada inválidos',
                details: body.error.issues
            });
        }

        try {
            const nuevoPedido = await this.pedidoService.crearPedido(body.data);

            const pedidoDTO = pedidoToDTO(nuevoPedido);
            res.status(201).json(pedidoDTO);

        } catch(error) {
            next(error);
        }
    }

    async obtenerPedidos(req, res, next) {
        try{
            const pedidos = await this.pedidoService.obtenerPedidos();
            return res.status(200).json(pedidos);
        }catch(error){
            next(error);
        }
    }

    async consultarHistorialPedido(req, res, next) {
        const { usuarioId } = req.query;

        if (!usuarioId) {
            return res.status(400).json({ message: 'El parámetro usuarioId es requerido' });
        }

        try {
            const pedidos = await this.pedidoService.obtenerPedidosPorUsuario(usuarioId);
            const pedidosDTO = pedidos.map(pedidoToDTO);
            res.status(200).json(pedidosDTO);
        } catch(error) {
            next(error);
        }
    }
    
    async cancelarPedido(req, res, next) {
        const { pedidoId } = req.params;
        const { motivo, usuarioId } = req.body;

        try {
            const pedidoCancelado = await this.pedidoService.cancelarPedido(pedidoId, motivo, usuarioId);
            res.status(200).json(pedidoToDTO(pedidoCancelado));

        } catch(error) {
            next(error);
        }
    }

    async cambiarCantidadItem(req, res, next) {
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
            next(error);
        }
    }
}

export default PedidoController;
