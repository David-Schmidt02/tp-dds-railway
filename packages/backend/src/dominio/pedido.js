import { EstadoPedido } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { ItemPedido } from "./itemPedido.js"
import { DireccionEntrega } from "./direccionEntrega.js"
import { Usuario } from "./usuario.js"
import { FactoryNotificacion } from "./notificaciones.js"
import { NotificacionesRepository } from "../repositories/notificacionRepository.js"

export class Pedido {
    id;
    comprador;
    itemsPedido;
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

    transicionarA(nuevoEstado) {
        this.estado.puedeTransicionarA(nuevoEstado)
    }
    
    validarStock() { return this.itemsPedido.every(item => item.producto.estaDisponible(item.cantidad)) }

    agregarItem(item){
        this.itemsPedido.push(item);
    }


    sacarItem(item){
        this.itemsPedido.pop(item);
    }

}



