import { UsuarioYaExiste, EmailInvalido, DatosUsuarioInvalidos } from '../excepciones/usuario.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async crearUsuario(req, res) {
    try {
      const datosUsuario = req.body;
      
      const nuevoUsuario = await this.usuarioService.crearUsuario(datosUsuario);
      
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          id: nuevoUsuario.id,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          email: nuevoUsuario.email,
          telefono: nuevoUsuario.telefono,
          direccion: nuevoUsuario.direccion,
          fechaNacimiento: nuevoUsuario.fechaNacimiento,
          activo: nuevoUsuario.activo,
          createdAt: nuevoUsuario.createdAt
        }
      });
    } catch (error) {
      if (error instanceof UsuarioYaExiste) {
        return res.status(409).json({
          success: false,
          message: error.message,
          error: 'USUARIO_YA_EXISTE'
        });
      }

      if (error instanceof EmailInvalido) {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: 'EMAIL_INVALIDO'
        });
      }

      if (error instanceof DatosUsuarioInvalidos) {
        return res.status(400).json({
          success: false,
          message: error.message,
          error: 'DATOS_INVALIDOS'
        });
      }

      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
}