export class Pedido {
    id
    comprador
    items
    total
    moneda
    direccionEntrega
    estado
    fechaCreacion
    historialEstados

    constructor(comprador, items, moneda, direccionEntrega) {
        this.id = PedidoRepository.siguienteId(); // TODO: Pedidorepository
        this.comprador = comprador;
        this.itemsPedido = [];
        this.total = 0;
        this.moneda = moneda; 
        this.direccionEntrega = direccionEntrega; 
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = Date.now();
        this.historialEstados = []; 

        new Notificacion(m) 
    }

    calcularTotal() { return this.itemsPedido.reduce((acc, item) => acc + item.subtotal(), 0) }

    
    actualizarEstado(nuevoEstado, usuario, motivo ) {
        estado = new EstadoPedido.nuevoEstado
	    this.estado = estado
	    new CambioEstadoPedido(estado, this, usuario, motivo)
    }
    
    validarStock() { return this.itemsPedido.every(item => item.producto.estaDisponible(item.cantidad)) }
}


export class EstadoPedido {
    nombre;
    destinos;
    constructor(nombre){ 
        this.nombre = nombre 
        this.destinos = new Set();

    }

    puedeTransicionarA(estadoDestino){
        return this.destinos.has(estadoDestino);
    }

}

EstadoPedido.PENDIENTE = new EstadoPedido("PENDIENTE", [EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO]);
EstadoPedido.CONFIRMADO = new EstadoPedido("CONFIRMADO", [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO]);
EstadoPedido.EN_PREPARACION = new EstadoPedido("EN_PREPARACION", [EstadoPedido.ENVIADO, EstadoPedido.CANCELADO]);
EstadoPedido.ENVIADO = new EstadoPedido("ENVIADO", [EstadoPedido.ENTREGADO]);
EstadoPedido.ENTREGADO = new EstadoPedido("ENTREGADO", []);
EstadoPedido.CANCELADO = new EstadoPedido("CANCELADO", []);


export class Moneda {
    nombre;
    constructor(nombre){ this.nombre = nombre }
}

Moneda.PESO_ARG = new Moneda("PESO_ARG")
Moneda.DOLAR_USA = new Moneda("DOLAR_USA")
Moneda.REAL  = new Moneda("REAL")

export class TipoUsuario {
    nombre;
    constructor(nombre){ this.nombre = nombre }
}

TipoUsuario.COMPRADOR = new TipoUsuario("COMPRADOR")
TipoUsuario.VENDEDOR = new TipoUsuario("VENDEDOR")
TipoUsuario.ADMIN = new TipoUsuario("ADMIN")

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
        this.motivo = motivo ?? nulll;

        if(!this.pedido.estado.puedeTransicionarA(nuevoEstado)){
            throw new Error('Transicion de estado invalida');
        }
        this.nuevoEstado = nuevoEstado;

        if(nuevoEstado = EstadoPedido.ENVIADO){
            new Notificacion()
        }else if(nuevoEstado = EstadoPedido.CANCELADO){
            
        }
        
    }
    
    
    

}

export class DireccionEntrega {
    calle
    altura
    piso
    departamento
    codigoPostal
    ciudad
    provincia
    pais
    latitud
    longitud

    constructor(calle, altura, piso, departamento) {
        this.calle = calle
        this.altura = altura
        this.piso = piso
        this.departamento = departamento
        // el resto suponemos que son calculables
    }

}

export class FactorYnotificacion {
    crarSegunEstadoPedido(estadoPedido) {//TODO}
    }
}


export class Notificacion {
    id
    usuario
    mensaje
    fechaAlta
    leida
    fechaLeida

    constructor(usurio, mensaje) {
        this
    }

    marcarComerLeida() {
        this.leida = true
    }
}

export class Producto {
    id
    vendedor
    titulo
    descripcion
    categorias
    precio
    moneda
    stock
    fotos
    activo

    constructor(vendedor, titulo, descripcion, categorias, precio, moneda, stock, fotos, activo) {
        //this.id
        this.vendedor = vendedor
        this.titulo = titulo
        this.descripcion = descripcion
        this.categorias = categorias  
        this.precio = precio
        this.moneda = moneda
        this.stock = stock 
        this.fotos = fotos 
        this.activo = activo
    }
    
	estaDiponible(cantidad) {
		if(this.stock >= cantidad){
			return true
		}else { return false }
	}

    reducirStock(cantidad) {
        this.stock -= cantidad
    }

    aumentarStock(cantidad) {
        this.stock += cantidad
    }
}

export class Usuario {
    id
    nombre
    email
    telefono
    tipo
    fechaAlta
   
    constructor(id, nombre, email, telefono, tipo, fechaAlta) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipo = tipo; // TipoUsuario
    this.fechaAlta = fechaAlta;
  }
}

export class categoria {
    nombre
    constructor(nombre) { this.nombre = nombre }
}

class ItemPedido {
    producto
    cantidad
    precioUnitario

    constructor(producto, cantidad, precioUnitario) {
        this.producto = producto; 
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    subtotal() {
        return this.cantidad * this.precioUnitario;
    }
}