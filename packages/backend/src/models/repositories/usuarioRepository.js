import { ObjectId } from "mongodb";
import { UsuarioInexistente } from "../../excepciones/usuario.js";
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
        return await UsuarioModel.create(usuario);
    }

    async obtenerTodos() {
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