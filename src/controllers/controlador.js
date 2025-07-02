const Usuario = require("../models/usuario.model");
const Laboratorio = require("../models/laboratorio.model");
const Equipo = require("../models/equipo.model");

// === CONTROLADORES USUARIO ===
const createUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: error.message });
  }
};

// === CONTROLADORES LABORATORIO ===
const createLaboratorio = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.create(req.body);
    const laboratorioCompleto = await Laboratorio.findById(laboratorio._id).populate('responsable');
    res.status(201).json(laboratorioCompleto);
  } catch (error) {
    console.error("Error al crear laboratorio:", error);
    res.status(500).json({ error: error.message });
  }
};

const getLaboratorios = async (req, res) => {
  try {
    const laboratorios = await Laboratorio.find().populate('responsable');
    res.json(laboratorios);
  } catch (error) {
    console.error("Error al obtener laboratorios:", error);
    res.status(500).json({ error: error.message });
  }
};

// === CONTROLADORES EQUIPO ===
const createEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.create(req.body);
    const equipoCompleto = await Equipo.findById(equipo._id).populate('laboratorio');
    res.status(201).json(equipoCompleto);
  } catch (error) {
    console.error("Error al crear equipo:", error);
    res.status(500).json({ error: error.message });
  }
};

const getEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.find().populate('laboratorio');
    res.json(equipos);
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    res.status(500).json({ error: error.message });
  }
};

// === CONSULTAS AVANZADAS ===

// 1. Listar todos los usuarios
const listarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({
      consulta: "Listar todos los usuarios",
      total: usuarios.length,
      datos: usuarios
    });
  } catch (error) {
    console.error("Error en consulta 1:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Buscar laboratorios que tengan equipos disponibles
const laboratoriosConEquiposDisponibles = async (req, res) => {
  try {
    const equiposDisponibles = await Equipo.find({ estado: 'disponible' })
      .populate('laboratorio')
      .distinct('laboratorio');
    
    const laboratorios = await Laboratorio.find({ _id: { $in: equiposDisponibles } })
      .populate('responsable');
    
    res.json({
      consulta: "Laboratorios con equipos disponibles",
      total: laboratorios.length,
      datos: laboratorios
    });
  } catch (error) {
    console.error("Error en consulta 2:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Contar cantidad de equipos por estado
const contarEquiposPorEstado = async (req, res) => {
  try {
    const conteo = await Equipo.aggregate([
      {
        $group: {
          _id: "$estado",
          cantidad: { $sum: 1 }
        }
      },
      {
        $sort: { cantidad: -1 }
      }
    ]);
    
    res.json({
      consulta: "Cantidad de equipos por estado",
      datos: conteo
    });
  } catch (error) {
    console.error("Error en consulta 3:", error);
    res.status(500).json({ error: error.message });
  }
};

// 4. Buscar usuarios cuyo correo termine en @universidad.edu
const usuariosUniversidad = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ 
      correo: { $regex: /@universidad\.edu$/, $options: 'i' }
    });
    
    res.json({
      consulta: "Usuarios con correo @universidad.edu",
      total: usuarios.length,
      datos: usuarios
    });
  } catch (error) {
    console.error("Error en consulta 4:", error);
    res.status(500).json({ error: error.message });
  }
};

// 5. Promedio de equipos por laboratorio usando aggregate
const promedioEquiposPorLaboratorio = async (req, res) => {
  try {
    const resultado = await Equipo.aggregate([
      {
        $lookup: {
          from: 'laboratorios',
          localField: 'laboratorio',
          foreignField: '_id',
          as: 'laboratorioInfo'
        }
      },
      {
        $unwind: '$laboratorioInfo'
      },
      {
        $group: {
          _id: '$laboratorio',
          nombreLaboratorio: { $first: '$laboratorioInfo.nombre' },
          cantidadEquipos: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          promedioEquipos: { $avg: '$cantidadEquipos' },
          detallesPorLab: {
            $push: {
              laboratorio: '$nombreLaboratorio',
              cantidadEquipos: '$cantidadEquipos'
            }
          }
        }
      }
    ]);
    
    res.json({
      consulta: "Promedio de equipos por laboratorio",
      datos: resultado
    });
  } catch (error) {
    console.error("Error en consulta 5:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // CRUD básico
  createUsuario,
  getUsuarios,
  createLaboratorio,
  getLaboratorios,
  createEquipo,
  getEquipos,
  
  // Consultas avanzadas
  listarTodosUsuarios,
  laboratoriosConEquiposDisponibles,
  contarEquiposPorEstado,
  usuariosUniversidad,
  promedioEquiposPorLaboratorio
};