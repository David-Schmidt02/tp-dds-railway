import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    required: false,
    trim: true
  },
  tipoUsuario: {
    type: String,
    enum: ["COMPRADOR", "VENDEDOR", "ADMIN"],
    required: true
  },
  fechaAlta: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'usuarios'
});
usuarioSchema.loadClass(class Usuario {});
export const UsuarioModel = mongoose.model('Usuario', usuarioSchema);