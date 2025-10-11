import { NotificacionInexistente, EstadoNoSoportado } from "../../excepciones/notificacion.js"
import{ Pedido } from "./pedido.js"
import { Producto } from "./producto.js";
import { EstadoPedido } from "./estadoPedido.js";
import { NotificacionRepository } from "../repositories/notificacionRepository.js";


export class Notificacion{
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