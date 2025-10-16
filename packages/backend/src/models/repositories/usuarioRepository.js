    
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

    async obtenerTodosUsuarios() {
        return await UsuarioModel.find();
    }

    async eliminarUsuario(id) {
        const usuario = await UsuarioModel.findByIdAndDelete(id);
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return usuario;
    }

    async guardarUsuario(usuario) {
        const id = usuario._id || usuario.id;
        const isUpdate = Boolean(id);
        const query = isUpdate ? { _id: id } : { _id: new UsuarioModel()._id };
        // Extraer datos desde la instancia de dominio
        const data = {
            nombre: usuario.nombre,
            email: usuario.email,
            password: usuario.password,
            direccion: usuario.direccion,
            telefono: usuario.telefono
        };
        // Si es creación, verificar duplicado por email
        if (!isUpdate) {
            const usuarioExistente = await UsuarioModel.findOne({ email: usuario.email });
            if (usuarioExistente) {
                throw new UsuarioYaExiste(usuario.email);
            }
        }
        const updated = await UsuarioModel.findOneAndUpdate(
            query,
            data,
            {
                new: true,
                runValidators: true,
                upsert: true
            }
        );
        if (!updated) {
            throw new Error('Usuario no guardado');
        }
        return updated;
    }
}