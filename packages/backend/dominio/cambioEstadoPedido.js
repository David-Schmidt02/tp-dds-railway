import{Pedido} from "./pedido.js"
import{EstadoPedido} from "./estadoPedido.js"
import{Usuario} from "./usuario.js"
import{FactoryNotificacion} from "./notificaciones.js"



export class CambioEstadoPedido{
    fecha
    nuevoEstado
    pedido 
    usuario
    motivo

    constructor(nuevoEstado, pedido, usuario, motivo){
        this.fecha = new Date();
        this.nuevoEstado = nuevoEstado
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo ?? null;

        if(!this.pedido.estado.puedeTransicionarA(nuevoEstado)){
            throw new Error('Transicion de estado invalida');
        }
        this.nuevoEstado = nuevoEstado;
        this.pedido.estado() = nuevoEstado;

        if(this.nuevoEstado == EstadoPedido.ENVIADO){
            FactoryNotificacion.crearSegunEstadoPedido(this.nuevoEstado, this.usuario);
        }else if(nuevoEstado == EstadoPedido.CANCELADO){
            const vendedor = pedido.obtenerVendedor();
            FactoryNotificacion.crearSegunEstadoPedido(nuevoEstado, vendedor);
            
        }
        
    }

}