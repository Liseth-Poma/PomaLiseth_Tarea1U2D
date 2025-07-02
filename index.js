const express = require("express");
const mongoose = require("mongoose");
const mainRoutes = require("./src/routes/routes");

const app = express();
app.use(express.json());

const connectionString =
  "mongodb://admin:admin123@localhost:2717/espe-mongoose?authSource=admin";

mongoose
  .connect(connectionString)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error de conexión:", error));

// Rutas
app.use("/api", mainRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API de Gestión de Laboratorios - ESPE",
    endpoints: {
      usuarios: "/api/usuarios",
      laboratorios: "/api/laboratorios", 
      equipos: "/api/equipos",
      consultas: {
        "Todos los usuarios": "/api/consultas/usuarios-todos",
        "Labs con equipos disponibles": "/api/consultas/laboratorios-equipos-disponibles",
        "Equipos por estado": "/api/consultas/equipos-por-estado",
        "Usuarios universidad": "/api/consultas/usuarios-universidad",
        "Promedio equipos por lab": "/api/consultas/promedio-equipos-laboratorio"
      }
    }
  });
});


app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});