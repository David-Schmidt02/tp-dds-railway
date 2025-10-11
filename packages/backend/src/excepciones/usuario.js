export class UsuarioYaExiste extends Error {
  constructor(email) {
    super(`Ya existe un usuario con el email: ${email}`);
    this.name = 'UsuarioYaExiste';
  }
}

export class UsuarioInexistente extends Error {
  constructor(id) {
    super(`El usuario con id: ${id}, no existe`);
    this.name = 'UsuarioInexistente';
  }
}

export class EmailInvalido extends Error {
  constructor(email) {
    super(`El email ${email} no tiene un formato válido`);
    this.name = 'EmailInvalido';
  }
}

export class DatosUsuarioInvalidos extends Error {
  constructor(mensaje) {
    super(`Datos de usuario inválidos: ${mensaje}`);
    this.name = 'DatosUsuarioInvalidos';
  }
}

export class CredencialesInvalidas extends Error {
  constructor() {
    super(`Las credenciales proporcionadas son incorrectas`);
    this.name = 'CredencialesInvalidas';
  }
}

export class UsuarioInactivo extends Error {
  constructor(id) {
    super(`El usuario con id: ${id}, está inactivo`);
    this.name = 'UsuarioInactivo';
  }
}

export class PermisosInsuficientes extends Error {
  constructor(accion) {
    super(`El usuario no tiene permisos para realizar la acción: ${accion}`);
    this.name = 'PermisosInsuficientes';
  }
}