const express = require("express");
const router = express.Router();
const controller = require("../controllers/controlador");

// === RUTAS CRUD USUARIOS ===
router.post("/usuario", controller.createUsuario);
router.get("/usuarios", controller.getUsuarios);

// === RUTAS CRUD LABORATORIOS ===
router.post("/laboratorio", controller.createLaboratorio);
router.get("/laboratorios", controller.getLaboratorios);

// === RUTAS CRUD EQUIPOS ===
router.post("/equipo", controller.createEquipo);
router.get("/equipos", controller.getEquipos);

// === RUTAS CONSULTAS AVANZADAS ===
router.get("/consultas/usuarios-todos", controller.listarTodosUsuarios);
router.get("/consultas/laboratorios-equipos-disponibles", controller.laboratoriosConEquiposDisponibles);
router.get("/consultas/equipos-por-estado", controller.contarEquiposPorEstado);
router.get("/consultas/usuarios-universidad", controller.usuariosUniversidad);
router.get("/consultas/promedio-equipos-laboratorio", controller.promedioEquiposPorLaboratorio);

module.exports = router;