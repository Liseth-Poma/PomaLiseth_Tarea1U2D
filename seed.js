const mongoose = require("mongoose");
const Usuario = require("./src/models/usuario.model");
const Laboratorio = require("./src/models/laboratorio.model");
const Equipo = require("./src/models/equipo.model");

const connectionString =
  "mongodb://admin:admin123@localhost:2717/espe-mongoose?authSource=admin";

const seedData = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("Conectado a MongoDB para insertar datos de prueba");

    // Limpiar colecciones existentes
    await Usuario.deleteMany({});
    await Laboratorio.deleteMany({});
    await Equipo.deleteMany({});

    // Insertar usuarios
    const usuarios = await Usuario.insertMany([
      {
        nombre: "Juan",
        apellido: "Pérez",
        correo: "juan.perez@universidad.edu",
        rol: "profesor"
      },
      {
        nombre: "María",
        apellido: "González",
        correo: "maria.gonzalez@universidad.edu",
        rol: "administrador"
      },
      {
        nombre: "Carlos",
        apellido: "López",
        correo: "carlos.lopez@gmail.com",
        rol: "estudiante"
      },
      {
        nombre: "Ana",
        apellido: "Martínez",
        correo: "ana.martinez@universidad.edu",
        rol: "profesor"
      },
      {
        nombre: "Luis",
        apellido: "Rodríguez",
        correo: "luis.rodriguez@hotmail.com",
        rol: "estudiante"
      }
    ]);

    console.log("Usuarios insertados:", usuarios.length);

    // Insertar laboratorios
    const laboratorios = await Laboratorio.insertMany([
      {
        nombre: "Laboratorio de Computación",
        ubicacion: "Edificio A - Piso 2",
        capacidad: 30,
        descripcion: "Laboratorio equipado con computadoras modernas para clases de programación",
        responsable: usuarios[0]._id,
        horarioDisponible: {
          inicio: "08:00",
          fin: "18:00"
        }
      },
      {
        nombre: "Laboratorio de Física",
        ubicacion: "Edificio B - Piso 1",
        capacidad: 25,
        descripcion: "Laboratorio de física experimental con equipos especializados",
        responsable: usuarios[1]._id,
        horarioDisponible: {
          inicio: "07:00",
          fin: "19:00"
        }
      },
      {
        nombre: "Laboratorio de Química",
        ubicacion: "Edificio C - Piso 3",
        capacidad: 20,
        descripcion: "Laboratorio de química con campanas extractoras y equipos de seguridad",
        responsable: usuarios[3]._id,
        horarioDisponible: {
          inicio: "08:00",
          fin: "17:00"
        }
      }
    ]);

    console.log("Laboratorios insertados:", laboratorios.length);

    // Insertar equipos
    const equipos = await Equipo.insertMany([
      // Equipos Lab Computación
      {
        nombre: "PC-001",
        tipo: "computadora",
        marca: "Dell",
        modelo: "OptiPlex 7090",
        numeroSerie: "DL001",
        estado: "disponible",
        laboratorio: laboratorios[0]._id,
        fechaAdquisicion: new Date("2023-01-15"),
        especificaciones: new Map([
          ["RAM", "16GB"],
          ["CPU", "Intel i7"],
          ["GPU", "Intel UHD"]
        ])
      },
      {
        nombre: "PC-002",
        tipo: "computadora",
        marca: "HP",
        modelo: "EliteDesk 800",
        numeroSerie: "HP001",
        estado: "en_uso",
        laboratorio: laboratorios[0]._id,
        fechaAdquisicion: new Date("2023-02-20"),
        especificaciones: new Map([
          ["RAM", "8GB"],
          ["CPU", "Intel i5"],
          ["GPU", "Intel UHD"]
        ])
      },
      {
        nombre: "Proyector-001",
        tipo: "proyector",
        marca: "Epson",
        modelo: "PowerLite 2247U",
        numeroSerie: "EP001",
        estado: "disponible",
        laboratorio: laboratorios[0]._id,
        fechaAdquisicion: new Date("2023-03-10"),
        especificaciones: new Map([
          ["Resolución", "1920x1200"],
          ["Brillo", "4200 lúmenes"]
        ])
      },
      // Equipos Lab Física
      {
        nombre: "Microscopio-001",
        tipo: "microscopio",
        marca: "Olympus",
        modelo: "CX23",
        numeroSerie: "OL001",
        estado: "disponible",
        laboratorio: laboratorios[1]._id,
        fechaAdquisicion: new Date("2022-12-05"),
        especificaciones: new Map([
          ["Magnificación", "40x-1000x"],
          ["Tipo", "Óptico"]
        ])
      },
      {
        nombre: "Balanza-001",
        tipo: "otro",
        marca: "Sartorius",
        modelo: "Quintix 124-1S",
        numeroSerie: "SA001",
        estado: "mantenimiento",
        laboratorio: laboratorios[1]._id,
        fechaAdquisicion: new Date("2023-04-15"),
        especificaciones: new Map([
          ["Precisión", "0.1mg"],
          ["Capacidad", "120g"]
        ])
      },
      // Equipos Lab Química
      {
        nombre: "PC-LAB-QUI-001",
        tipo: "computadora",
        marca: "Lenovo",
        modelo: "ThinkCentre M720q",
        numeroSerie: "LN001",
        estado: "disponible",
        laboratorio: laboratorios[2]._id,
        fechaAdquisicion: new Date("2023-05-20"),
        especificaciones: new Map([
          ["RAM", "8GB"],
          ["CPU", "Intel i5"],
          ["Almacenamiento", "256GB SSD"]
        ])
      },
      {
        nombre: "Impresora-001",
        tipo: "impresora",
        marca: "Canon",
        modelo: "PIXMA G3010",
        numeroSerie: "CN001",
        estado: "dañado",
        laboratorio: laboratorios[2]._id,
        fechaAdquisicion: new Date("2022-08-10"),
        especificaciones: new Map([
          ["Tipo", "Multifuncional"],
          ["Conectividad", "WiFi, USB"]
        ])
      }
    ]);

    console.log("Equipos insertados:", equipos.length);
    console.log("Datos de prueba insertados exitosamente");

  } catch (error) {
    console.error("Error al insertar datos:", error);
  } finally {
    await mongoose.disconnect();
  }
};

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  seedData();
}

//consultAs


module.exports = seedData;