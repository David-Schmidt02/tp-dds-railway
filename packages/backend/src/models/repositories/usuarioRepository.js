import { ObjectId } from "mongodb";
import { UsuarioInexistente, UsuarioYaExiste } from "../../excepciones/usuario.js";
import { UsuarioModel } from '../../schema/usuarioSchema.js';

export class UsuarioRepository {
    constructor() {
        // No necesitas db con Mongoose
    }

    async obtenerUsuarioPorId(id) {
        const usuario = await UsuarioModel.findById(id);
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return usuario;
    }

    async crearUsuario(usuario) {
        try {
            // Verificar si el usuario ya existe
            const usuarioExistente = await UsuarioModel.findOne({ email: usuario.email });
            if (usuarioExistente) {
                throw new UsuarioYaExiste(usuario.email);
            }

            return await UsuarioModel.create(usuario);
        } catch (error) {
            // Si es error de duplicado de MongoDB (por si acaso)
            if (error.code === 11000) {
                throw new UsuarioYaExiste(usuario.email);
            }
            throw error;
        }
    }

    async obtenerTodosUsuarios() {
        return await UsuarioModel.find();
    }

    async actualizarUsuario(id, updates) {
        const usuario = await UsuarioModel.findByIdAndUpdate(id, updates, { new: true });
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return usuario;
    }

    async eliminarUsuario(id) {
        const usuario = await UsuarioModel.findByIdAndDelete(id);
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return usuario;
    }
}