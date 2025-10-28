
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

    constructor(id, receptorId, mensaje, leida = false, fechaAlta = new Date()) {
        this.id = id
        this.receptorId = receptorId;
        this.mensaje = mensaje;
        this.fechaAlta = fechaAlta;
        this.leida = leida;
        this.fechaLeida = null;
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaLeida = new Date();
    }
}