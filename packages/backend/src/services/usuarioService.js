import { Usuario } from '../models/entities/usuario.js';
import { tipoUsuarioFromString } from '../dto/usuarioDTO.js';

export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async crearUsuario(datosUsuario) {
    const {nombre, email, telefono, tipoUsuario} = datosUsuario;
    const tipo =  tipoUsuarioFromString(tipoUsuario);
    const usuario = new Usuario(nombre, email, telefono, tipo);
    console.log(usuario);
    const nuevoUsuario = await this.usuarioRepository.guardarUsuario(usuario);
    return nuevoUsuario;
  }
  async obtenerTodosUsuarios() {
    return await this.usuarioRepository.obtenerTodosUsuarios();
  }

  async obtenerVendedores() {
    return await this.usuarioRepository.obtenerUsuariosPorTipo('VENDEDOR');
  }
}