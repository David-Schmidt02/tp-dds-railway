export class PedidoInexistente extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, no existe`);
  }
}

export class PedidoNoModificable extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, no puede ser modificado en su estado actual`);
  }
}

export class EstadoPedidoInvalido extends Error {
  constructor(estadoActual, estadoNuevo) {
    super(`No se puede cambiar el estado del pedido de ${estadoActual} a ${estadoNuevo}`);
  }
}

export class PedidoYaCancelado extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, ya está cancelado`);
  }
}

export class PedidoYaEntregado extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, ya fue entregado`);
  }
}