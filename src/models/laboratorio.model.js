const mongoose = require("mongoose");
const { Schema } = mongoose;

const laboratorioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  ubicacion: {
    type: String,
    required: true,
    trim: true
  },
  capacidad: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  descripcion: {
    type: String,
    maxlength: 500
  },
  responsable: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  horarioDisponible: {
    inicio: {
      type: String,
      required: true
    },
    fin: {
      type: String,
      required: true
    }
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Laboratorio", laboratorioSchema);