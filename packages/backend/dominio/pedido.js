import { EstadoPedido } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { ItemPedido } from "./itemPedido.js"
import { DireccionEntrega } from "./direccionEntrega.js"
import { Usuario } from "./usuario.js"
import { FactoryNotificacion } from "./notificaciones.js"
import { NotificacionesRepository } from "../src/repositories/notificacionRepository.js"

export class Pedido {
    id;
    comprador;
    itemsPedido;
    total;
    moneda;
    direccionEntrega;
    estado;
    fechaCreacion;
    historialEstados;

    constructor(comprador, items, moneda, direccionEntrega) {
        // El id se asigna en el repository
        this.comprador = comprador;
        this.itemsPedido = items;
        this.total = 0;
        this.moneda = moneda; 
        this.direccionEntrega = direccionEntrega; 
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = new Date();
        this.historialEstados = []; 

        const notificacion = FactoryNotificacion.crearSegunPedido(this);
        if (notificacion) {
            NotificacionesRepository.agregarNotificacion(notificacion);
        }
    }

    calcularTotal() { return this.itemsPedido.reduce((acc, item) => acc + item.subtotal(), 0) }

    
    actualizarEstado(nuevoEstado, usuario, motivo ) {
	    new CambioEstadoPedido(nuevoEstado, this, usuario, motivo)
    }
    
    validarStock() { return this.itemsPedido.every(item => item.producto.estaDisponible(item.cantidad)) }

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

}



