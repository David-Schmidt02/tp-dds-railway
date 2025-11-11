    
import { ObjectId } from "mongodb";
import { UsuarioInexistente, UsuarioYaExiste } from "../../excepciones/usuario.js";
import { UsuarioModel } from '../../schema/usuarioSchema.js';

export class UsuarioRepository {
    constructor() {
    }

    async obtenerUsuarioPorId(id) {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return usuario;
    }

    async obtenerTodosUsuarios() {
        return await UsuarioModel.find();
    }

    async obtenerUsuariosPorTipo(tipoUsuario) {
        return await UsuarioModel.find({ tipoUsuario });
    }

    async eliminarUsuario(id) {
        const usuario = await UsuarioModel.findByIdAndDelete(id);
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return usuario;
    }

    async guardarUsuario(usuario) {
        const data = {
            nombre: usuario.nombre,
            email: usuario.email,
            direccion: usuario.direccion,
            telefono: usuario.telefono,
            tipoUsuario: usuario.tipoUsuario.nombre
        };

        const usuarioExistente = await UsuarioModel.findOne({ email: usuario.email });
        if (usuarioExistente) {
                throw new UsuarioYaExiste(usuario.email);
        }

        const usuarioGuardado = await UsuarioModel.create(data)
        if (!usuarioGuardado) {
            throw new Error('Usuario no guardado');
        }
        return usuarioGuardado;
    }
}