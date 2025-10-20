export class ProductoInexistente extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no existe`);
    this.name = 'ProductoInexistente';
  }
}

export class ProductoStockInsuficiente extends Error {
  constructor(id, stockDisponible, stockSolicitado) {
    super(`Stock insuficiente para el producto con id: ${id}. Disponible: ${stockDisponible}, Solicitado: ${stockSolicitado}`);
    this.name = 'ProductoStockInsuficiente';
  }
}

export class ProductoSinStock extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no tiene stock disponible`);
    this.name = 'ProductoSinStock';
  }
}

export class ProductoNoDisponible extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no está disponible para la venta`);
    this.name = 'ProductoNoDisponible';
  }
}

export class CategoriaInvalida extends Error {
  constructor(categoria) {
    super(`La categoría ${categoria} no es válida`);
    this.name = 'CategoriaInvalida';
  }
}

export class PrecioInvalido extends Error {
  constructor(precio) {
    super(`El precio ${precio} no es válido`);
    this.name = 'PrecioInvalido';
  }
}

export class ProductoInactivo extends Error {
  constructor() {
    super(`El producto esta inactivo`);
    this.name = 'ProductoInactivo';
  }
}