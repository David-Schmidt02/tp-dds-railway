// import { UsuarioInexistente } from "../excepciones/notificaciones.js" // TODO: crear excepción si no existe

export const UsuariosRepository = {
    usuarios: [],

    agregarUsuario(usuario) {
        usuario.id = this.obtenerSiguienteId()
        this.usuarios.push(usuario)
        return usuario
    },

    obtenerPorId(id){
        const usuario = this.id.find(u => u.id === id);
        if(!usuario) {
            throw new UsuarioInexistente() // TODO: hacer la excepcion
        }
        return usuario;
    },

    obtenerPorEmail(email){
        const usuario = this.email.find(u => u.email === email);
        if(!usuario) {
            throw new UsuarioInexistente()
        }
        return usuario;
    },

    obtenerSiguienteId() {//TODO en una DB real no es necesario
        return (this.usuarios[this.usuarios.length - 1]?.id || 0) + 1;
    }

}