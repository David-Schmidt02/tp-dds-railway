import { EstadoPedido } from "./estadoPedido.js"
import { CambioEstadoPedido } from "./cambioEstadoPedido.js"
import { ItemPedido } from "./itemPedido.js"
import { DireccionEntrega } from "./direccionEntrega.js"
import { Usuario } from "./usuario.js"
import { PedidoNoModificable } from "../../excepciones/pedido.js"

export class Pedido {
    id;
    comprador;
    itemsPedido;
    moneda;
    direccionEntrega;
    estado;
    fechaCreacion;
    historialEstados;

    constructor(comprador, items, moneda, direccionEntrega, id = null) {
        this.id = id;
        this.comprador = comprador;
        this.itemsPedido = items;
        this.moneda = moneda; 
        this.direccionEntrega = direccionEntrega; 
        this.estado = EstadoPedido.PENDIENTE;
        this.fechaCreacion = new Date();
        this.historialEstados = []; 
    }

    calcularTotal() { return this.itemsPedido.reduce((acc, item) => acc + item.subtotal(), 0) }

    
    actualizarEstado(nuevoEstado, usuario, motivo ) {
        this.historialEstados.push(this.estado)

        if (this.estado.puedeTransicionarA(nuevoEstado)){ // Puede ser una excepcion.
            this.estado = new CambioEstadoPedido(nuevoEstado, this, usuario, motivo);
            this.historialEstados.push(new CambioEstadoPedido(nuevoEstado, this, usuario, motivo)) // Revisar
            this.estado = nuevoEstado;
        }
    }
    
    validarStock() { return this.itemsPedido.every(item => item.producto.estaDisponible(item.cantidad)) }

    agregarItem(item){
        this.itemsPedido.push(item);
    }

    sacarItem(item){
        this.itemsPedido.pop(item);
    }

    obtenerCantidadItem(productoId) {
        const item = this.itemsPedido.find(item => item.getId() === productoId);
        return item ? item.cantidad : null;
    }

    puedeModificarItems() {
        // Solo se puede modificar si no ha sido enviado
        let nombre = this.estado.nombre
        return nombre !== 'ENVIADO' && nombre !== 'ENTREGADO' && nombre !== 'CANCELADO';
    }

    puedeCancelarse() {
        // Solo se puede cancelar si no ha sido enviado ni entregado, y tampoco si ya está cancelado
        let nombre = this.estado.nombre
        return nombre !== 'ENVIADO' && nombre !== 'ENTREGADO' && nombre !== 'CANCELADO';
    }

    modificarCantidadItem(productoId, nuevaCantidad) {
        if (!this.puedeModificarItems()) {
            throw new PedidoNoModificable(this.estado);
        }

        const item = this.itemsPedido.find(item => item.getId() === productoId);
        if (!item) {
            throw new Error('Producto no encontrado en el pedido');
        }

        item.cambiarCantidad(nuevaCantidad);

    }

    
    perteneceAUsuario(usuarioId) {
        return this.comprador.getId() === usuarioId;
    }

}



