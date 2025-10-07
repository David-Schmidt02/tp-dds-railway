import { ObjectId } from "mongodb";
import { UsuarioInexistente } from "../excepciones/notificaciones.js";

export class UsuarioRepository {
    constructor(db) {
        this.usuarios = db.collection("usuarios");
    }

    aUsuarioDB(usuario) {
        const usuarioDB = { ...usuario };
        delete usuarioDB.id; // MongoDB usa _id
        return usuarioDB;
    }

    deUsuarioDB(usuarioDB) {
        return {
            ...usuarioDB,
            id: usuarioDB._id.toString()
        };
    }

    async agregarUsuario(usuario) {
        const usuarioDB = this.aUsuarioDB(usuario);
        const result = await this.usuarios.insertOne(usuarioDB);
        return {
            ...usuario,
            id: result.insertedId.toString()
        };
    }

    async obtenerPorId(id) {
        const usuario = await this.usuarios.findOne({ _id: new ObjectId(id) });
        if (!usuario) {
            throw new UsuarioInexistente(id);
        }
        return this.deUsuarioDB(usuario);
    }

    async obtenerPorEmail(email) {
        const usuario = await this.usuarios.findOne({ email: email });
        if (!usuario) {
            throw new UsuarioInexistente(email);
        }
        return this.deUsuarioDB(usuario);
    }

    async obtenerTodosLosUsuarios() {
        const cursor = await this.usuarios.find();
        const usuarios = [];
        for await (const doc of cursor) {
            usuarios.push(this.deUsuarioDB(doc));
        }
        return usuarios;
    }

    async actualizarUsuario(usuarioActualizado) {
        await this.usuarios.updateOne(
            { _id: new ObjectId(usuarioActualizado.id) },
            { $set: this.aUsuarioDB(usuarioActualizado) }
        );
        return usuarioActualizado;
    }

    async eliminarUsuario(id) {
        const result = await this.usuarios.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }
}