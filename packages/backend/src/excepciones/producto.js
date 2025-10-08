export class ProductoInexistente extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no existe`);
  }
}

export class ProductoStockInsuficiente extends Error {
  constructor(id, stockDisponible, stockSolicitado) {
    super(`Stock insuficiente para el producto con id: ${id}. Disponible: ${stockDisponible}, Solicitado: ${stockSolicitado}`);
  }
}

export class ProductoSinStock extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no tiene stock disponible`);
  }
}

export class ProductoNoDisponible extends Error {
  constructor(id) {
    super(`El producto con id: ${id}, no está disponible para la venta`);
  }
}

export class CategoriaInvalida extends Error {
  constructor(categoria) {
    super(`La categoría ${categoria} no es válida`);
  }
}

export class PrecioInvalido extends Error {
  constructor(precio) {
    super(`El precio ${precio} no es válido`);
  }
}