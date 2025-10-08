import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema({
  receptorId: {
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
  fechaCreacion: {
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

notificacionSchema.loadClass(class Notificacion{});
export const NotificacionModel = mongoose.model('Notificacion', notificacionSchema);

notificacionSchema.pre('save', function(next) {
  if (this.isModified('leida') && this.leida && !this.fechaLeida) {
    this.fechaLeida = new Date();
  }
  next();
});


