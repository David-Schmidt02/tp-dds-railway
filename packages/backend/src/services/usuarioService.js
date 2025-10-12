export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async crearUsuario(datosUsuario) {
    // Crear el usuario usando el repository
    const nuevoUsuario = await this.usuarioRepository.crearUsuario(datosUsuario);

    return nuevoUsuario;
  }
}