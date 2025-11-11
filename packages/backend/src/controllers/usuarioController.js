import { usuarioToDTO, usuariosToDTO } from '../dto/usuarioDTO.js';
import { usuarioSchema } from '../models/entities/validaciones.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async crearUsuario(req, res, next) {
    const body = req.body;

    const resultBody = usuarioSchema.safeParse(body);

    if (resultBody.error) {
      return res.status(400).json({
        message: 'Datos de entrada inválidos',
        details: resultBody.error.issues
      });
    }

    try {
      const nuevoUsuario = await this.usuarioService.crearUsuario(resultBody.data);
      res.status(201).json(usuarioToDTO(nuevoUsuario));
    } catch (error) {
      next(error);
    }
  }
  async obtenerUsuarios(req, res, next) {
    try {
      const usuarios = await this.usuarioService.obtenerTodosUsuarios();
      res.json(usuariosToDTO(usuarios));
    } catch (error) {
      next(error);
    }
  }

  async obtenerVendedores(req, res, next) {
    try {
      const vendedores = await this.usuarioService.obtenerVendedores();
      res.json(usuariosToDTO(vendedores));
    } catch (error) {
      next(error);
    }
  }
}