import { Pedido } from '../dominio/pedido.js';
import { pedidoSchema } from '../dominio/validaciones.js';
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';

export const pedidos = []


function pedidoToDTO(pedido) {
    return {
        id: pedido.id,
        comprador: {
            id: pedido.comprador.id,
            nombre: pedido.comprador.nombre,
            email: pedido.comprador.email,

        },
        items: pedido.itemsPedido.map(item => ({
            producto: {
                id: item.producto.id,
                titulo: item.producto.titulo,
                descripcion: item.producto.descripcion,
                precio: item.producto.precio,
                categoria: item.producto.categoria,

            },
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.subtotal
        })),
        total: pedido.total,
        moneda: {
            codigo: pedido.moneda.codigo,
            simbolo: pedido.moneda.simbolo,
            nombre: pedido.moneda.nombre
        },
        direccionEntrega: {
            calle: pedido.direccionEntrega.calle,
            numero: pedido.direccionEntrega.numero,
            ciudad: pedido.direccionEntrega.ciudad,
            provincia: pedido.direccionEntrega.provincia,
            pais: pedido.direccionEntrega.pais,
            codigoPostal: pedido.direccionEntrega.codigoPostal

        },
        estado: {
            nombre: pedido.estado.nombre,
            fecha: pedido.estado.fecha

        },
        fechaCreacion: pedido.fechaCreacion,
        fechaActualizacion: pedido.fechaActualizacion,
        observaciones: pedido.observaciones

    };
}

//Versión con Service y Repository

export class PedidoController {
    constructor(pedidoService){
        this.pedidoService = pedidoService;
    }

    async crearPedido(req, res) {

        const body = req.body;
        const resultBody = pedidoSchema.safeParse(body);
        if(resultBody.error){
            return res.status(400).json({ error: resultBody.error.details[0].message });
        }
        try{
            const nuevoPedido = await this.pedidoService.crearPedido(body);
            console.log('Nuevo pedido creado:', nuevoPedido);
            res.status(201).json(pedidoToDTO(nuevoPedido));
        }catch(error){
            if(error instanceof ProductoInexistente) {
             return res.status(422 ).json({ error: 'Error al crear el pedido.' });
            }
            if(error instanceof ProductoStockInsuficiente)  
             return res.status(409).json({ error: 'No hay stock suficiente.' });   
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
    
    async cancelarPedido(req, res) {
        const { id } = req.params;
        const { motivo } = req.body;
        const usuario = req.user; // Si usas autenticación, o lo obtienes del body
        try{
            const pedidoCancelado = await this.pedidoService.cancelarPedido(id, motivo, usuario);
            res.status(200).json((pedidoCancelado));
        }catch(error){
            if(error instanceof PedidoInexistente) {
             return res.status(422).json({ error: 'Error al cancelar el pedido.' });
            }
        }
    }

async cambiarCantidadItem(req, res) {
    const { idPedido } = req.params;
    const { idItem } = req.params.idItem;
    const { nuevaCantidad } = req.body.cantidad;
    try {
        const pedidoActualizado = await this.pedidoService.cambiarCantidadItem(idPedido, idItem, nuevaCantidad);
        if (!pedidoActualizado) {
            return res.status(404).json({ error: 'Pedido no encontrado.' });
        }
        res.status(200).json(pedidoToDTO(pedidoActualizado));
    } catch (error) {
            if(error instanceof ProductoStockInsuficiente) {
                return res.status(409).json({ error: 'Error al cambiar la cantidad del item.' });
            }
    }
    }
}

export default PedidoController;
