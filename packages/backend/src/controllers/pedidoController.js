import { Pedido } from '../dominio/pedido.js';
import { pedidoSchema } from '../dominio/validaciones.js';
import { Usuario } from '../dominio/usuario.js';
import { ItemPedido } from '../dominio/itemPedido.js';
import { Moneda } from '../dominio/moneda.js';
import { DireccionEntrega } from '../dominio/direccionEntrega.js';
import { ProductoInexistente, ProductoStockInsuficiente, PedidoInexistente } from '../excepciones/notificaciones.js';

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
        
        // Validar estructura del request
        const resultBody = pedidoSchema.safeParse(body);
        if(resultBody.error){
            return res.status(400).json({ 
                error: 'Datos de entrada inválidos', 
                details: resultBody.error.errors 
            });
        }
        
        try {
            const nuevoPedido = await this.pedidoService.crearPedido(body);
            console.log('Nuevo pedido creado:', nuevoPedido.id);
            res.status(201).json(pedidoToDTO(nuevoPedido));
            
        } catch(error) {
            console.error('Error al crear pedido:', error.message);
            
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
            
            // Error genérico del servidor
            return res.status(500).json({ 
                error: 'Error interno del servidor al crear el pedido',
                message: error.message 
            });
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
