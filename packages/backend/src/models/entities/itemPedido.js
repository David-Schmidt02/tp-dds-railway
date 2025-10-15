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

    getId() {
        return this.producto.id;
    }

    reservarStockProductos() {
        this.producto.disminuirStock(this.cantidad);
    }

    devolverStockProductos() {
        this.producto.aumentarStock(this.cantidad);
    }

    cambiarCantidad(nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }
        
        this.cantidad = nuevaCantidad;

        // Ajustar stock según la diferencia
        const diferenciaCantidad = nuevaCantidad - this.cantidad;
        if (diferenciaCantidad > 0) {
            this.producto.disminuirStock(diferenciaCantidad);
        } else if (diferenciaCantidad < 0) {
            this.producto.aumentarStock(Math.abs(diferenciaCantidad));
        }
    }
}