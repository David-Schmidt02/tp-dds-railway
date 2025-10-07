import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  pedidoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: false
  },
  tipo: {
    type: String,
    required: true,
    enum: ['PEDIDO_CONFIRMADO', 'CAMBIO_ESTADO', 'PEDIDO_ENTREGADO', 'PEDIDO_CANCELADO', 'PROMOCION', 'SISTEMA']
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  mensaje: {
    type: String,
    required: true,
    trim: true
  },
  leida: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaLeida: {
    type: Date
  },
  metadatos: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'notificaciones'
});

notificacionSchema.loadClass(class Notificacion{}); // le avisa a mongoose que use la clase Notificacion le corresponde a este schema

// Middleware para actualizar fechaLeida cuando se marca como leída
notificacionSchema.pre('save', function(next) {
  if (this.isModified('leida') && this.leida && !this.fechaLeida) {
    this.fechaLeida = new Date();
  }
  next();
});

// Índices para mejorar las consultas
notificacionSchema.index({ usuarioId: 1, leida: 1 });
notificacionSchema.index({ fechaCreacion: -1 });
notificacionSchema.index({ tipo: 1 });

export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema); // Exporta el modelo de Mongoose