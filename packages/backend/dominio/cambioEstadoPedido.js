export class CambioEstadoPedido{
    fecha
    nuevoEstado
    pedido 
    usuario
    motivo

    constructor(nuevoEstado, pedido, usuario, motivo){
        this.fecha = Date.now();
        this.pedido = pedido;
        this.usuario = usuario;
        this.motivo = motivo ?? null;

        if(!this.pedido.estado.puedeTransicionarA(nuevoEstado)){
            throw new Error('Transicion de estado invalida');
        }
        this.nuevoEstado = nuevoEstado;

        if(this.nuevoEstado = EstadoPedido.ENVIADO){
            FactoryNotificacion.crearSegunEstadoPedido(this.nuevoEstado, this.usuario)
        }else if(nuevoEstado = EstadoPedido.CANCELADO){
            const vendedores = pedido.obtenerVendedores()
            vendedores.forEach(vendedor => {
                FactoryNotificacion.crearSegunEstadoPedido(nuevoEstado, vendedor);
            });
            vender
            
        }
        
    }

}