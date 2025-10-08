import{Pedido} from "./pedido.js"
import{EstadoPedido} from "./estadoPedido.js"
import{Usuario} from "./usuario.js"
import{FactoryNotificacion} from "./notificacion.js"


export class CambioEstadoPedido{
    fecha
    nuevoEstado
    pedido 
    usuario
    motivo

    constructor(estadoAnterior, nuevoEstado, pedido, usuario, motivo){
        this.fecha = new Date();
        this.nuevoEstado = nuevoEstado
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo ?? null;
        this.nuevoEstado = nuevoEstado;
        this.pedido.estado = nuevoEstado;
" pedido bla bla paso de 'PREPARACION' a 'EL SIGUIENTE'"
"el usariio cancelo el [pedido tanto por tal motivo"


        if(this.nuevoEstado == EstadoPedido.ENVIADO){

            FactoryNotificacion.crearSegunEstadoPedido(this.nuevoEstado, this.usuario);
        }else if(nuevoEstado == EstadoPedido.CANCELADO){
            const vendedor = pedido.obtenerVendedor();
            FactoryNotificacion.crearSegunEstadoPedido(nuevoEstado, vendedor);
            
        }
        
    }



}