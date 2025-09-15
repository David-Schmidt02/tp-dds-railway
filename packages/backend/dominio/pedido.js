import { EstadoPedido } from "./estadoPedido"
import { CambioEstadoPedido } from "./cambioEstadoPedido"
import { ItemPedido } from "./itemPedido"
import { DireccionEntrega } from "./direccionEntrega"
import { Usuario } from "./usuario"
import { FactoryNotificacion } from "./notificaciones"
import { NotificacionesRepository } from "../scr/repositories/notificacionRepository"

export class Pedido {
    id
    comprador
    itemsPedido
    total
    moneda
    direccionEntrega
    estado
    fechaCreacion
    historialEstados

    constructor(comprador, items, moneda, direccionEntrega) {
        this.id = PedidoRepository.siguienteId(); // TODO: Pedidorepository
        this.comprador = comprador;
        this.itemsPedido = [];
        this.total = 0;
        this.moneda = moneda; 
        this.direccionEntrega = direccionEntrega; 
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = new Date();
        this.historialEstados = []; 

        const notificacion = FactoryNotificacion.crearSegunPedido(this);
        NotificacionesRepository.agregarNotificacion(notificacion);

    }

    calcularTotal() { return this.itemsPedido.reduce((acc, item) => acc + item.subtotal(), 0) }

    
    actualizarEstado(nuevoEstado, usuario, motivo ) {
	    new CambioEstadoPedido(estado, this, usuario, motivo)
    }
    
    validarStock() { return this.itemsPedido.every(item => item.producto.estaDisponible(item.cantidad)) }

    obtenerVendedores() { 
        const vendedores = new Set(this.items.map(i => i.producto.vendedor));
        return Array.from(vendedores);
        }
    
    ///////////////////CASO SI SE TIENE UN SOLO VENDEDOR POR PEDIDO (AGREGAR ATRIBUTO VENDEDOR A LA CLASE)//////////////////////////////////////////////////////////////
    agregarItem(item){
        if(this.itemsPedido = []){
            this.itemsPedido.push(item);
            this.vendedor = item.producto.vendedor;
        }
        if(this.vendedor != item.producto.vendedor){
            throw new Error("Todos los items del pedido deben ser del mismo vendedor");
        }
        this.itemsPedido.push(item);
    }


    sacarItem(item){
        this.itemsPedido.pop(item);
        if(this.itemsPedido = []){
            this.vendedor = null;
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}



