import { Collection, ObjectId } from "mongodb";
import {ProductoInexistente} from "../excepciones/notificaciones.js";
import {ProductoStockInsuficiente} from "../excepciones/notificaciones.js";
import { Producto } from "../dominio/producto.js";

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

  /**
   * Reserva stock de manera atómica para evitar condiciones de carrera
   * Utiliza findOneAndUpdate con filtro de stock suficiente
   */
  async reservarStock(idProducto, cantidad) {
    const result = await this.productos.findOneAndUpdate(
      { 
        _id: new ObjectId(idProducto),
        stock: { $gte: cantidad }, // cosa de mongo: Pregunta si stock >= cantidad
        activo: true
      },
      { $inc: { stock: -cantidad } }, // Reduce el stock atómicamente
      { 
        returnDocument: 'after', // Retorna el documento actualizado
        upsert: false  // No crear si no existe
      }
    );

    if (!result) {
      // Verificamos si el producto existe pero no tiene stock suficiente
      const producto = await this.productos.findOne({ _id: new ObjectId(idProducto) });
      if (!producto) {
        throw new ProductoInexistente(idProducto);
      }
      throw new ProductoStockInsuficiente(idProducto);
    }

    return cantidad;
  }

  /**
   * Devuelve stock al producto (para cancelaciones)
   */
  async cancelarStock(idProducto, cantidad) {
    const result = await this.productos.findOneAndUpdate(
      { _id: new ObjectId(idProducto) },
      { $inc: { stock: cantidad } },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new ProductoInexistente(idProducto);
    }

    return cantidad;
  }

  /**
   * Verifica si hay stock disponible sin reservarlo
   */
  async tieneStock(idProducto, cantidad) {
    const producto = await this.productos.findOne({
      _id: new ObjectId(idProducto),
      stock: { $gte: cantidad },
      activo: true
    });
    return producto !== null;
  }

  /**
   * Obtiene el precio unitario actual del producto
   */
  async obtenerPrecioUnitario(idProducto) {
    const producto = await this.obtenerProductoPorId(idProducto);
    return producto.precio;
  }
}