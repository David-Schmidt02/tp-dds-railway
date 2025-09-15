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
            
            let comprador = this.usuarioRepository.buscarPorEmail(compradorDTO.email);
            if(!comprador) {
                this.usuarioRepository.agregarUsuario(compradorDTO.nombre, compradorDTO.email, compradorDTO.telefono, TipoUsuario.COMPRADOR);
            } // TODO: hacer un service

            const items = itemsDTO.map(item => new ItemPedido(item.producto, item.cantidad));
            if(esMonedaValida(monedaDTO.nombre)){
                const moneda = Moneda.deNombre(monedaDTO.nombre);
            }
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
