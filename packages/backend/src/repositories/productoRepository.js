import {ProductoInexistente} from "../excepciones/notificaciones.js";
import {ProductoStockInsuficiente} from "../excepciones/notificaciones.js";


const ProductoRepository = {
  productos: [
  {
    id: 1,
    vendedor: {
      nombre: "Vendedor 1",
      email: "vendedor@mail.com",
      telefono: "87654321",
      tipoUsuario: "VENDEDOR"
    },
    titulo: "Producto 1",
    descripcion: "Descripción del producto",
    categorias: ["cat1"],
    precio: 100,
    moneda: "PESO_ARG",
    stock: 10,
    activo: true
  }
],

  agregarProducto(producto){
    producto.id = this.obtenerSiguienteId();
    this.productos.push(producto);
    return producto;
  },

  listar(){
    return this.productos;
  },

  obtenerProductoPorId(id){
    const producto = this.productos.find(p => p.id === id);
    if(!producto){
      throw new ProductoInexistente(id);
    }
    return producto;
  },

  guardarProducto(productoActualizado){
    remove(this.productos, p => p.id === productoActualizado.id);
    this.productos.push(productoActualizado);
    return productoActualizado;
  },

  borrar(producto){
    remove(this.productos, p => p.nombre === producto.nombre);
  },

  obtenerSiguienteId() {//TODO en una DB real no es necesario
    return (this.productos[this.productos.length - 1]?.id || 0) + 1;
  },

  reservarStock(idProducto, cantidad) {
    const producto = this.obtenerProductoPorId(idProducto);
    if (!producto.estaDisponible(cantidad)) {
      throw new Error(new ProductoStockInsuficiente(id));
    }else{
        producto.reducirStock(cantidad)
    }
    return cantidad;
  }
}

export { ProductoRepository };