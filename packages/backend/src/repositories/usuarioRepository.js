import { ObjectId } from "mongodb";
import { UsuarioInexistente } from "../excepciones/usuario.js";
import { UsuarioModel } from '../schema/usuarioSchema.js';

export class UsuarioRepository {
    constructor() {
        // No necesitas db con Mongoose
    }

    async obtenerUsuarioPorId(id) {
        return await UsuarioModel.findById(id);
    }

    async crearUsuario(usuario) {
        return await UsuarioModel.create(usuario);
    }

    async obtenerTodos() {
        return await UsuarioModel.find();
    }

    async actualizarUsuario(id, updates) {
        return await UsuarioModel.findByIdAndUpdate(id, updates, { new: true });
    }

    async eliminarUsuario(id) {
        return await UsuarioModel.findByIdAndDelete(id);
    }
}