import{Pedido} from "./pedido.js"
import{EstadoPedido} from "./estadoPedido.js"
import{Usuario} from "./usuario.js"

export class CambioEstadoPedido{
    fecha
    nuevoEstado
    pedido 
    usuario
    motivo

    constructor(estadoAnterior, nuevoEstado, pedido, usuario, motivo){
        this.fecha = new Date();
        this.estadoAnterior = estadoAnterior
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo ?? null;
        this.nuevoEstado = nuevoEstado;
        this.pedido.estado = nuevoEstado;
    }
}