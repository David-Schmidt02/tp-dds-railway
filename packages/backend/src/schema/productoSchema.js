import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    valor: {
      type: Number,
      required: true,
      min: 0
    },
    moneda: {
      type: String,
      required: true,
      enum: ['ARS', 'USD', 'EUR'],
      default: 'ARS'
    }
  },
  categoria: {
    type: String,
    required: true,
    enum: ['ELECTRONICA', 'ROPA', 'HOGAR', 'DEPORTES', 'LIBROS', 'OTROS']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  imagenes: [{
    url: String,
    alt: String
  }],
  disponible: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'productos'
});

// Índices para mejorar las consultas
productoSchema.index({ nombre: 'text', descripcion: 'text' });
productoSchema.index({ categoria: 1 });
productoSchema.index({ 'precio.valor': 1 });

export const Producto = mongoose.model('Producto', productoSchema);