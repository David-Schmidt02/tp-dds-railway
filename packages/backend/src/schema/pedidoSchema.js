import mongoose from 'mongoose';

// Schema para cambio de estado
const cambioEstadoSchema = new mongoose.Schema({
  estadoAnterior: {
    type: String,
    enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO']
  },
  estadoNuevo: {
    type: String,
    required: true,
    enum: ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO']
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

// Schema para items del pedido
const itemPedidoSchema = new mongoose.Schema({
  producto: {
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
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

// Schema principal del pedido
const pedidoSchema = new mongoose.Schema({
  usuario: {
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
  },
  estado: {
    type: String,
    required: true,
    default: 'PENDIENTE'
  },
  historialEstados: [cambioEstadoSchema],
  total: {
      type: Number,
      required: true,
      min: 0
  },
  fechaPedido: {
    type: Date,
    default: Date.now
  },
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

// Crear el modelo
export const PedidoModel = mongoose.model('Pedido', pedidoSchema);

// Exportar también como Pedido para compatibilidad
export const Pedido = PedidoModel;