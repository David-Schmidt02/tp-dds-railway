export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async crearUsuario(datosUsuario) {
  const usuario = new Usuario(datosUsuario);
  const nuevoUsuario = await this.usuarioRepository.guardarUsuario(usuario);
  return nuevoUsuario;
  }
  async obtenerTodosUsuarios() {
    return await this.usuarioRepository.obtenerTodosUsuarios();
  }
}