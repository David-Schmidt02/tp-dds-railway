import{Producto} from "./producto.js"

export class ItemPedido {
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

    obtenerVendedor(){
        return this.producto.getVendedor();
    }
}