import { NotificacionInexistente, EstadoNoSoportado } from "../excepciones/notificacion.js"
import{ Pedido } from "./pedido.js"
import { Producto } from "./producto.js";
import { EstadoPedido } from "./estadoPedido.js";
import { NotificacionRepository } from "../repositories/notificacionRepository.js";


export class Notificacion{
    id;
    receptor;
    mensaje;
    fechaAlta;
    leida;
    fechaLeida;

    constructor(receptor, mensaje) {
        this.receptor = receptor;
        this.mensaje = mensaje;
        this.fechaAlta = new Date();
        this.leida = false;
        this.fechaLeida = null;
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaLeida = new Date();
    }
}


export class FactoryNotificacion {
    static crearSegunPedido(pedido) {
        const mensaje = FactoryNotificacion.crearSegunEstadoPedido(pedido);
        let receptor;
    
        switch (pedido.estado.nombre) {
            case "PENDIENTE":
                receptor = pedido.vendedor;   // notificar al vendedor
            break;

            case "ENVIADO":
                receptor = pedido.comprador;  // notificar al comprador
            break;

            case "CANCELADO":
                receptor = pedido.vendedor;   // notificar al vendedor
            break;

            default:
                throw new Error(`Estado no soportado: ${pedido.estado.nombre}`);
        }

        const notificacion = new Notificacion(receptor, mensaje);
        NotificacionRepository.agregarNotificacion(notificacion);
    }

    static crearSegunEstadoPedido(pedido) {
    const productos = (pedido.itemsPedido ?? [])
        .map(item => item?.producto?.nombre)
        .filter(Boolean);

    switch (pedido?.estado?.nombre) {
        case 'PENDIENTE':
            return {
                comprador: pedido.comprador,
                productos,
                total: pedido.total,
                direccionEntrega: pedido.direccionEntrega
            };
    
        case 'ENVIADO':
                return {
                comprador: pedido.comprador,
                productos,
                fechaEntrega: pedido.fechaEntregaEstimada ?? new Date(),
                estado: pedido.estado?.nombre
            };
    
        case 'CANCELADO':
            return { comprador: pedido.comprador };
        
        default:
            throw new EstadoNoSoportado(pedido?.estado?.nombre);
    }
  }
}


