import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema({
  receptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
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
  fechaAlta: {
    type: Date,
    default: Date.now
  },
  fechaLeida: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'notificaciones'
});

notificacionSchema.pre('save', function(next) {
  if (this.isModified('leida') && this.leida && !this.fechaLeida) {
    this.fechaLeida = new Date();
  }
  next();
});

notificacionSchema.loadClass(class Notificacion{});
export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);


