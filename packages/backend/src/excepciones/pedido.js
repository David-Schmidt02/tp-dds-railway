export class PedidoInexistente extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, no existe`);
    this.name = 'PedidoInexistente';
  }
}

export class PedidoNoModificable extends Error {
  constructor(estado) {
    super(`No se puede modificar un pedido en estado ${estado}`);
    this.name = 'PedidoNoModificable';
  }
}

export class PedidoNoCancelable extends Error {
  constructor(estado) {
    super(`No se puede cancelar un pedido en estado ${estado}`);
    this.name = 'PedidoNoCancelable';
  }
}

export class EstadoPedidoInvalido extends Error {
  constructor(estadoActual, estadoNuevo) {
    super(`No se puede cambiar el estado del pedido de ${estadoActual} a ${estadoNuevo}`);
    this.name = 'EstadoPedidoInvalido';
  }
}

export class PedidoYaCancelado extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, ya está cancelado`);
    this.name = 'PedidoYaCancelado';
  }
}

export class PedidoYaEntregado extends Error {
  constructor(id) {
    super(`El pedido con id: ${id}, ya fue entregado`);
    this.name = 'PedidoYaEntregado';
  }
}