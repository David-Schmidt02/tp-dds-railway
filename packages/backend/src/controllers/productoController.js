/*
import { Pedido } from '../dominio/pedido.js';
import { pedidoSchema } from '../dominio/validaciones.js';
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';

export const pedidos = []

//Version con Service y Repository

export class PedidoController {
    constructor(pedidoService){
        this.pedidoService = pedidoService;
    }

    crearPedido(req, res) {
        const body = req.body;
        const resultBody = pedidoSchema.safeParse(body);
        if(resultBody.error){
            return res.status(400).json({ error: resultBody.error.details[0].message });
        }
        try{
            const nuevoPedido = this.pedidoService.crearPedido(body);
            res.status(201).json(nuevoPedido);
        }catch(error){
                console.log('Error al crear el pedido:', error);
                return res.status(500).json({ error: 'Error al crear el pedido.' });
        }
    }

    obtenerPedido(req, res) {
        const id = req.params.id;
        try{
            const pedido = this.pedidoService.obtenerPedido(id);
            return res.status(200).json(pedido);
        }catch(error){
            return res.status(500).json({ error: 'Error al obtener el pedido.' });
        }
    }

    obtenerPedidos(req, res) {
        try{
            const pedidos = this.pedidoService.obtenerPedidos();
            return res.status(200).json(pedidos);
        }catch(error){
            return res.status(500).json({ error: 'Error al obtener los pedidos.' });
        }
    }   
}

export default PedidoController;
*/