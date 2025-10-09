import { Usuario } from '../models/Usuario.js';
import { UsuarioYaExiste, EmailInvalido, DatosUsuarioInvalidos } from '../excepciones/usuario.js';

export class UsuarioService {
  static async crearUsuario(datosUsuario) {
    try {
      // Validar email
      if (!this.validarEmail(datosUsuario.email)) {
        throw new EmailInvalido(datosUsuario.email);
      }

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({
        where: { email: datosUsuario.email }
      });

      if (usuarioExistente) {
        throw new UsuarioYaExiste(datosUsuario.email);
      }

      // Validar datos requeridos
      this.validarDatosRequeridos(datosUsuario);

      // Crear el usuario
      const nuevoUsuario = await Usuario.create({
        nombre: datosUsuario.nombre.trim(),
        apellido: datosUsuario.apellido.trim(),
        email: datosUsuario.email.toLowerCase().trim(),
        telefono: datosUsuario.telefono?.trim(),
        direccion: datosUsuario.direccion?.trim(),
        fechaNacimiento: datosUsuario.fechaNacimiento
      });

      return nuevoUsuario;
    } catch (error) {
      if (error instanceof UsuarioYaExiste || 
          error instanceof EmailInvalido || 
          error instanceof DatosUsuarioInvalidos) {
        throw error;
      }
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  static validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validarDatosRequeridos(datos) {
    if (!datos.nombre || datos.nombre.trim().length < 2) {
      throw new DatosUsuarioInvalidos('El nombre debe tener al menos 2 caracteres');
    }

    if (!datos.apellido || datos.apellido.trim().length < 2) {
      throw new DatosUsuarioInvalidos('El apellido debe tener al menos 2 caracteres');
    }

    if (!datos.email || !datos.email.trim()) {
      throw new DatosUsuarioInvalidos('El email es obligatorio');
    }

    if (datos.telefono && !/^[0-9+\-\s()]+$/.test(datos.telefono)) {
      throw new DatosUsuarioInvalidos('El formato del teléfono no es válido');
    }
  }
}