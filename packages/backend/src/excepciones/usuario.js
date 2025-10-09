export class UsuarioYaExiste extends Error {
  constructor(email) {
    super(`Ya existe un usuario con el email: ${email}`);
  }
}

export class UsuarioInexistente extends Error {
  constructor(id) {
    super(`El usuario con id: ${id}, no existe`);
  }
}

export class EmailInvalido extends Error {
  constructor(email) {
    super(`El email ${email} no tiene un formato válido`);
  }
}

export class DatosUsuarioInvalidos extends Error {
  constructor(mensaje) {
    super(`Datos de usuario inválidos: ${mensaje}`);
  }
}

export class CredencialesInvalidas extends Error {
  constructor() {
    super(`Las credenciales proporcionadas son incorrectas`);
  }
}

export class UsuarioInactivo extends Error {
  constructor(id) {
    super(`El usuario con id: ${id}, está inactivo`);
  }
}

export class PermisosInsuficientes extends Error {
  constructor(accion) {
    super(`El usuario no tiene permisos para realizar la acción: ${accion}`);
  }
}