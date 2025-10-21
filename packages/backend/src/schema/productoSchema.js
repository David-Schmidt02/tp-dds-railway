import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    categorias: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'Debe tener al menos una categoría'
      }
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    moneda: {
      type: String,
      required: true,
      default: 'ARS'
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    fotos: {
        type: [String],
        required: true
    }, 
    activo:{
      type: Boolean,
      required: true
    },
    vendidos: {
      type: Number,
      required: true,
      default: 0
    }
},{
  timestamps: true,
  collection: 'productos',
  versionKey: 'version',
  optimisticConcurrency: true
});

productoSchema.loadClass(class Producto{});
export const ProductoModel = mongoose.model('Producto', productoSchema);