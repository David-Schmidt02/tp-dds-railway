
import { NotificacionInexistente, EstadoNoSoportado } from "../../excepciones/notificacion.js"
import{ Pedido } from "./pedido.js"
import { Producto } from "./producto.js";
import { EstadoPedido } from "./estadoPedido.js";
import { NotificacionRepository } from "../repositories/notificacionRepository.js";


export class Notificacion{
    id
    receptorId;
    mensaje;
    fechaAlta;
    leida;
    fechaLeida;

    constructor(receptorId, mensaje, leida = false, fechaAlta = new Date(), id = null) {
        this.receptorId = receptorId;
        this.mensaje = mensaje;
        this.leida = leida;
        this.fechaAlta = fechaAlta;
        this.id = id;
        this.fechaLeida = null;
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaLeida = new Date();
    }
}