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
        this.stock >= cantidad
    }

    reducirStock(cantidad) {
        this.stock -= cantidad
    }

    aumentarStock(cantidad) {
        this.stock += cantidad
    }

    getVendedor() {
        return this.vendedor
    }
}
