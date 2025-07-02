const mongoose = require("mongoose");
const { Schema } = mongoose;

const equipoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['computadora', 'microscopio', 'proyector', 'impresora', 'otro'],
    required: true
  },
  marca: {
    type: String,
    required: true,
    trim: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  numeroSerie: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  estado: {
    type: String,
    enum: ['disponible', 'en_uso', 'mantenimiento', 'dañado'],
    default: 'disponible'
  },
  laboratorio: {
    type: Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: true
  },
  fechaAdquisicion: {
    type: Date,
    required: true
  },
  especificaciones: {
    type: Map,
    of: String
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Equipo", equipoSchema);