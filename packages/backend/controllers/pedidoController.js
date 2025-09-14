import { Pedido } from '../dominio/pedido.js';
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';

export const pedidos = []

export class PedidoController {
    static crearPedido(req, res) {
        try{
            const { compradorDTO, itemsDTO, monedaDTO, direccionEntregaDTO } = req.body;
            const comprador = new Usuario(compradorDTO.id, compradorDTO.nombre, compradorDTO.email);
            const items = itemsDTO.map(item => new ItemPedido(item.producto, item.cantidad));
            const moneda = new Moneda(monedaDTO.codigo, monedaDTO.simbolo);
            const direccionEntrega = new DireccionEntrega(direccionEntregaDTO.calle, direccionEntregaDTO.ciudad, direccionEntregaDTO.codigoPostal, direccionEntregaDTO.pais);
            const pedido = new Pedido(comprador, items, moneda, direccionEntrega);
            
            if (!pedido.validarStock()) {
                return res.status(400).json({ error: 'No hay suficiente stock para uno o más productos en el pedido.' });
            }
            return res.status(201).json({ message: 'Pedido creado exitosamente.' });
        }catch(error){
            return res.status(500).json({ error: 'Error al crear el pedido.' });
        }
    }
    static obtenerPedidos(req, res) {
        return res.status(200).json(pedidos);
    }   
}

export default PedidoController;
