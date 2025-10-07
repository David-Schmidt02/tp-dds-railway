import { Collection } from "mongodb";
import {ProductoInexistente} from "../excepciones/notificaciones.js";
import {ProductoStockInsuficiente} from "../excepciones/notificaciones.js";
import { id } from "zod/locales";

export class ProductoRepository {
  constructor(db) {
    this.productos = db.collection("productos");
  }

  aProductoDB(producto) {
    const productoDB = {
      ...producto,
      vendedor: producto.vendedor.nombre, // Solo el identificador
      categorias: producto.categorias.map(cat => cat.nombre), // Solo nombres de categorías
      moneda: producto.moneda.nombre // Solo nombre de moneda
    };
    delete productoDB.id; // MongoDB usa _id
    return productoDB;
  }

  // Y el inverso para leer de DB
  deProductoDB(productoDB) {
    return new Producto(
      productoDB.vendedor,
      productoDB.titulo,
      productoDB.descripcion,
      productoDB.categorias, // Aquí tendrías que reconstruir objetos Categoria si es necesario
      productoDB.precio,
      productoDB.moneda,
      productoDB.stock,
      productoDB.fotos,
      productoDB.activo
    );
  }

  async agregarProducto(producto) {
    const productoDB = this.aProductoDB(producto);
    const result = await this.productos.insertOne(productoDB);
    return {
      ...producto,
      id: result.insertedId.toString()
    };
  }

  async listar() {
    const cursor = await this.productos.find();
    const productos = [];
    for await (const doc of cursor) {
      productos.push(this.deProductoDB(doc));
    }
    return productos;
  }

  async obtenerProductoPorId(id) {
    const producto = await this.productos.findOne({ _id: new ObjectId(id) });
    if (!producto) {
      throw new ProductoInexistente(id);
    }
    return this.deProductoDB(producto);
  }

  async guardarProducto(productoActualizado) {
    await this.productos.updateOne(
      { _id: new ObjectId(productoActualizado.id) },
      {
        $set: this.aProductoDB(productoActualizado),
      }
    );
    return productoActualizado;
  }

  async borrar(producto) {
    const result = await this.productos.deleteOne({ _id: new ObjectId(producto.id) });
    return result.deletedCount > 0;
  }

  reservarStock(idProducto, cantidad) { // No es async porque no hacemos operaciones de DB aquí(Lo hace guardarProducto)
    const producto = this.obtenerProductoPorId(idProducto);

    if (!producto.estaDisponible(cantidad)) {
      throw new ProductoStockInsuficiente(idProducto);
    }

    // Actualizar el stock en el objeto producto y guardar usando guardarProducto
    producto.reducirStock(cantidad);
    this.guardarProducto(producto);
    return cantidad;
  }

  async cancelarStock(idProducto, cantidad) {
    const producto = await this.obtenerProductoPorId(idProducto);

    await this.productos.updateOne(
      { _id: new ObjectId(idProducto) }, // Busca por ID
      { $inc: { stock: cantidad } }      // Suma cantidad al stock actual
    );

    return cantidad;
  }
}