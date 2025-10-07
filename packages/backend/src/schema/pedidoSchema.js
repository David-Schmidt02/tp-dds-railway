import mongoose from 'mongoose';

const itemPedidoSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
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
  subtotal: {
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
  }
}, { _id: false });

const cambioEstadoSchema = new mongoose.Schema({
  estadoAnterior: {
    type: String,
    enum: ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO']
  },
  estadoNuevo: {
    type: String,
    required: true,
    enum: ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO']
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  motivo: {
    type: String,
    trim: true
  }
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [itemPedidoSchema],
  direccionEntrega: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    provincia: { type: String, required: true },
    referencia: { type: String }
  },
  estado: {
    type: String,
    required: true,
    enum: ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'],
    default: 'PENDIENTE'
  },
  historialEstados: [cambioEstadoSchema],
  total: {
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
  fechaPedido: {
    type: Date,
    default: Date.now
  },
  fechaEntregaEstimada: {
    type: Date
  },
  observaciones: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'pedidos'
});

// Middleware para generar número de pedido automáticamente
pedidoSchema.pre('save', async function(next) {
  if (this.isNew && !this.numero) {
    const count = await mongoose.model('Pedido').countDocuments();
    this.numero = `PED-${Date.now()}-${count + 1}`;
  }
  next();
});

// Índices para mejorar las consultas
pedidoSchema.index({ usuarioId: 1 });
pedidoSchema.index({ estado: 1 });
pedidoSchema.index({ fechaPedido: -1 });
pedidoSchema.index({ numero: 1 });

pedidoSchema.loadClass(class Pedido{})
export const PedidoModel = mongoose.model('Pedido', pedidoSchema);