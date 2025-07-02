
# Construcción de una API RESTful con Base de Datos NoSQL y ORM (Mongoose)

**Liseth Carolina Poma Lagos**

---

## RESUMEN

En esta práctica se desarrolló una API RESTful utilizando el framework Express.js y el ORM Mongoose para gestionar una base de datos MongoDB. El objetivo principal fue implementar operaciones CRUD sobre una entidad `Course`, definiendo su modelo, rutas y controladores, y validando los datos recibidos. Se configuró la estructura modular del proyecto y se integró la herramienta `nodemon` para el reinicio automático del servidor. Además, se realizaron pruebas de los endpoints mediante Postman, verificando tanto las respuestas como las restricciones de validación. Finalmente, se utilizó mongo-express para visualizar las colecciones creadas, y se observó el correcto funcionamiento del sistema, cumpliendo con los objetivos planteados.

**Palabras Claves**: API RESTful, Mongoose, MongoDB

---

## 1. INTRODUCCIÓN

El desarrollo de aplicaciones modernas exige estructuras eficientes para la gestión de datos. En este laboratorio, se implementó una API RESTful utilizando Node.js, Express y Mongoose, para trabajar con una base de datos NoSQL (MongoDB). El enfoque se centró en modularizar el código, aplicar principios CRUD y establecer validaciones en los modelos de datos. Las actividades realizadas permitieron aplicar conocimientos teóricos y prácticos sobre la construcción de backends eficientes, configurando el entorno de desarrollo y validando su funcionamiento mediante herramientas como Postman y mongo-express.

---

## 2. OBJETIVO(S)

**2.1 Objetivo General:**

- Desarrollar una API RESTful con una base de datos NoSQL utilizando MongoDB y Mongoose para realizar operaciones CRUD sobre una entidad.

**2.2 Objetivos Específicos:**

- Implementar una estructura modular del proyecto.
- Configurar Mongoose como ORM para la base de datos.
- Definir rutas, controladores y modelos para la entidad `Course`.
- Validar el funcionamiento de la API mediante pruebas en Postman.

---

## 3. MARCO TEÓRICO

Una API RESTful (Representational State Transfer) es un conjunto de principios para diseñar servicios web que permiten la comunicación entre sistemas a través del protocolo HTTP. MongoDB es una base de datos NoSQL orientada a documentos, mientras que Mongoose es una biblioteca de Node.js que proporciona una solución basada en esquemas para modelar los datos en MongoDB. Express.js es un framework minimalista de backend que facilita la creación de servidores y rutas HTTP. Juntos, estos componentes permiten el desarrollo rápido y organizado de aplicaciones backend modernas.

---

## 4. DESCRIPCIÓN DEL PROCEDIMIENTO

### Paso 1: Instalar dependencias básicas

```bash
npm init
npm install mongoose
npm install --save-dev nodemon

````
**Iniciar Proyecto**

<img src="https://imgur.com/qoMibNU.png" alt="npm init" width="40%" />

**Instalar mongoose**

<img src="https://imgur.com/WwrMuL3.png" alt="Instalar mongoose" width="40%" />

**Instalar nodemon**

<img src="https://imgur.com/T4YzHBb.png" alt="Instalar nodemon" width="40%" />


Agregar en `package.json`:

```json
"scripts": {
  "start": "nodemon server.js"
}
```

---

### Paso 2: Estructura del Proyecto

```plaintext
api-rest-orm/
├── src/
│   ├── controllers/
│   │   └── course.controller.js
│   ├── models/
│   │   └── course.model.js
│   ├── routes/
│   │   └── course.routes.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

---

### Paso 3: Configuración del ORM - Mongoose

Archivo `src/index.js`:

```js
const express = require("express");
const mongoose = require("mongoose");
const courseRoutes = require("./routes/course.routes");

const app = express();
app.use(express.json());

const connectionString =
  "mongodb://admin:password123@localhost:27017/espe-mongoose?authSource=admin";

mongoose
  .connect(connectionString)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error de conexión:", error));

app.use("/", courseRoutes);

app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});
```

---

### Paso 4: Crear Controladores y Rutas

#### `controllers/course.controller.js`:

```js
const Course = require("../models/course.model");

const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    console.error("Error al crear el curso:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.json(course);
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        numberOfTopics: req.body.numberOfTopics || 0,
        publishedAt: new Date(),
      },
      { new: true }
    );
    res.json(course);
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Curso eliminado" });
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};

```

#### `routes/course.routes.js`:

```js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");

router.post("/course", courseController.createCourse);
router.get("/course", courseController.getCourses);
router.get("/course/:id", courseController.getCourseById);
router.put("/course/:id", courseController.updateCourse);
router.delete("/course/:id", courseController.deleteCourse);

module.exports = router;
```

---

### Paso 5: Configurar el Modelo

#### `models/course.model.js`:

```js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: [10, "No se cumple con la longitud mínima de 10 caracteres"],
    maxlength: 300,
  },
  numberOfTopics: {
    type: Number,
    default: 0,
    min: 0,
    max: 40,
  },
  publishedAt: Date,
});

module.exports = mongoose.model("Course", courseSchema);
```

---

### Paso 6: Ejecutar y Validar

**Levantar contenedores:**  
<img src="https://imgur.com/Ok4KXkS.png" alt="Levantamiento de contenedores" width="50%" />

**Iniciar el servidor:**

```bash
node index.js
````

<img src="https://imgur.com/Sfo9MaS.png" alt="Servidor funcionando" width="40%" />

**Probar en Postman:**

* Crear curso:

  <img src="https://imgur.com/22TzvJW.png" alt="Crear curso" width="30%" />
  
* Obtener curso por ID:

  <img src="https://imgur.com/8ypORI8.png" alt="Obtener curso" width="30%" />
  
* Obtener todos los cursos:

  <img src="https://imgur.com/hjfjZoc.png" alt="Obtener cursos" width="30%" />

* Actualizar curso:

  <img src="https://imgur.com/zvKnuBM.png" alt="Actualizar curso" width="30%" />
  
* Eliminar curso:

  <img src="https://imgur.com/USMEWRF.png" alt="Eliminar curso" width="30%" />

**Validaciones funcionando:** 

<img src="https://imgur.com/9wjx2E6.png" alt="Validación fallida" width="40%" />

**Vista en mongo-express:** 

<img src="https://imgur.com/v5HsYLR.png" alt="Vista mongo-express" width="40%" />

---

## 5. ANÁLISIS DE RESULTADOS

Durante la ejecución de la práctica, se observó que los endpoints desarrollados respondieron correctamente a las operaciones CRUD. Las validaciones aplicadas en el modelo permitieron restringir datos erróneos, como descripciones demasiado cortas. Las pruebas realizadas en Postman demostraron que la API responde con los códigos de estado HTTP adecuados. Además, al observar las colecciones desde mongo-express, se evidenció que los documentos eran creados y modificados correctamente, lo que valida el correcto uso de Mongoose como ORM.

---

## 6. DISCUSIÓN

Comparando la teoría con la práctica, se pudo confirmar la utilidad de una arquitectura modular al desarrollar una API. El uso de Mongoose permitió definir esquemas robustos y validaciones claras. Asimismo, Express.js facilitó la gestión de rutas y middleware. El aprendizaje práctico permitió reforzar conceptos como operaciones CRUD, validaciones de datos y organización del código en controladores, rutas y modelos.

---

## 7. CONCLUSIONES

* Se logró implementar una API RESTful funcional y modular utilizando Express y Mongoose.
* La estructura definida facilitó la mantenibilidad y escalabilidad del proyecto.
* Las validaciones aplicadas a nivel de modelo permitieron garantizar la integridad de los datos.
* El uso de herramientas como Postman y mongo-express permitió validar el correcto funcionamiento del sistema.

---

## 8. BIBLIOGRAFÍA

* MongoDB Inc. (2024). *Mongoose Documentation*. [https://mongoosejs.com/docs/](https://mongoosejs.com/docs/)
* Express.js Foundation. (2024). *Express Documentation*. [https://expressjs.com/](https://expressjs.com/)
* Postman. (2024). *Postman Learning Center*. [https://learning.postman.com/](https://learning.postman.com/)

