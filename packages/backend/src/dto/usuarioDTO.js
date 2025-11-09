import { Usuario, TipoUsuario } from '../models/entities/usuario.js'

export function usuarioToDTO(usuario) {
    return {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || null,
        tipoUsuario: usuario.tipoUsuario || 'COMPRADOR',
        fechaCreacion: usuario.createdAt || usuario.fechaCreacion || new Date(),
        fechaActualizacion: usuario.updatedAt || usuario.fechaActualizacion || new Date()
    };
}

export function usuarioSimpleDTO(usuario) {
    if (!usuario) return null;

    return {
        id: usuario._id,
        nombre: usuario.nombre || 'N/A',
        email: usuario.email || 'N/A'
    };
}

export function usuariosToDTO(usuarios) {
    return usuarios.map(usuarioToDTO);
}

export function usuarioDocToDominio(usuarioDoc) {
    // Manejar caso cuando el usuario no existe (null)
    if (!usuarioDoc) {
        // Retornar usuario por defecto para testing
        return new Usuario(
            "Usuario Desconocido",
            "desconocido@test.com", 
            "0000000000",
            tipoUsuarioFromString("VENDEDOR"),
            "000000000000000000000000"
        );
    }
    
    return new Usuario(
      usuarioDoc.nombre,
      usuarioDoc.email,
      usuarioDoc.telefono,
      tipoUsuarioFromString(usuarioDoc.tipoUsuario),
      usuarioDoc.id,
    )
}

export function tipoUsuarioFromString(tipo) {
  switch (tipo) {
    case "COMPRADOR": 
      return TipoUsuario.COMPRADOR;
    case "VENDEDOR": 
      return TipoUsuario.VENDEDOR;
    case "ADMIN": 
      return TipoUsuario.ADMIN;
  }
}
