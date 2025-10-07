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
  direcciones: [{
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    provincia: { type: String, required: true },
    esPrincipal: { type: Boolean, default: false }
  }],
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'usuarios'
});

export const Usuario = mongoose.model('Usuario', usuarioSchema);