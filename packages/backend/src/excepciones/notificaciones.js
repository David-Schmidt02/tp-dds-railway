export class NotificacionInexistente extends Error {
  constructor(id) {
    super(`La notificacion con id: ${id}, no existe`);
  }
}

export class EstadoNoSoportado extends Error {
  constructor(nombre) {
    super(`Estado no soportado ${nombre}`);
  }
}

export class ProductoInexistente extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no existe`);
  }
}

export class ProductoStockInsuficiente extends Error {
  constructor(id) {
    super(`Stock insuficiente para el producto con id: ${id}`);
  }
}

// Esto no es necesario ahora pero si cuando se exponga la api
