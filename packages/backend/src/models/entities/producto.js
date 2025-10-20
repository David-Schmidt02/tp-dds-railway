import { Usuario } from "./usuario.js"
import{ Categoria } from "./categoria.js"
import { Moneda } from "./moneda.js"
import { ProductoInactivo, ProductoStockInsuficiente } from "../../excepciones/producto.js"


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

    disminuirStock(cantidad) {
        if (!this.activo) throw new ProductoInactivo();
        if (this.estaDisponible(cantidad)) throw new ProductoStockInsuficiente();
        this.stock -= cantidad

    }
    
    estaDisponible(cantidad) {
        return this.stock >= cantidad;
    }

    aumentarStock(cantidad) {
        this.stock += cantidad
    }
}
