export class Usuario {
    id
    nombre
    email
    telefono
    tipoUsuario
    fechaAlta
   
    constructor(id, nombre, email, telefono, tipoUsuario ) {
      this.id = id;
      this.nombre = nombre;
      this.email = email;
      this.telefono = telefono;
      this.tipoUsuario = tipoUsuario; 
      this.fechaAlta = new Date();
  }
  
}

export class TipoUsuario {
    nombre;
    constructor(nombre){ this.nombre = nombre }
}


TipoUsuario.COMPRADOR = new TipoUsuario("COMPRADOR")
TipoUsuario.VENDEDOR = new TipoUsuario("VENDEDOR")
TipoUsuario.ADMIN = new TipoUsuario("ADMIN")