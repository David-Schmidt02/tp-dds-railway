import { usuarioToDTO } from '../dto/usuarioDTO.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async crearUsuario(req, res) {
    try {
      const datosUsuario = req.body;

      const nuevoUsuario = await this.usuarioService.crearUsuario(datosUsuario);

      res.status(201).json(usuarioToDTO(nuevoUsuario));
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        error: error.name || 'Error',
        message: error.message
      });
    }
  }
}