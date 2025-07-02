# Gestión de Laboratorios - MongoDB con Mongoose

**Estudiante:** Liseth Carolina Poma Lagos  
**Carrera:** Ingeniería en TI  
**Curso:** Aplicaciones Distribuidas  
**Fecha:** 1 de julio de 2025


## Introducción

Este proyecto implementa un sistema de gestión de laboratorios universitarios utilizando MongoDB como base de datos NoSQL y Mongoose como ODM (Object Document Mapping). El sistema permite gestionar usuarios, laboratorios y equipos, implementando relaciones entre colecciones y consultas avanzadas.

La importancia de las consultas avanzadas y relaciones en bases de datos NoSQL como MongoDB radica en la capacidad de modelar datos de manera flexible mientras se mantiene la integridad referencial y se optimizan las consultas para obtener información relacionada de manera eficiente.

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Docker & Docker Compose** - Containerización
- **Mongo Express** - Interface web para MongoDB

## Entorno de Desarrollo

### Configuración con Docker

El proyecto utiliza Docker Compose para levantar los siguientes servicios:
1. **MongoDB**: Base de datos principal en el puerto 2717
![Imgur](https://imgur.com/eNtnRC5.png)
2. **Mongo Express**: Interface web para administrar MongoDB en el puerto 8081
![Imgur](https://imgur.com/tEqsCAC.png)

**Entorno Docker funcionando**

![Imgur](https://imgur.com/nbRT5BF.png)

### Dependencias Instaladas

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "dotenv": "^16.3.1"
}
```

## Modelado de Datos

El sistema implementa tres modelos principales con sus respectivas relaciones:

### 1. Modelo Usuario
- **Campos**: nombre, apellido, correo, rol, fechaRegistro, activo
- **Validaciones**: correo único y formato válido
- **Roles**: estudiante, profesor, administrador

### 2. Modelo Laboratorio
- **Campos**: nombre, ubicación, capacidad, descripción, responsable, horarioDisponible, activo
- **Relación**: Referencia a Usuario (responsable)
- **Validaciones**: capacidad entre 1 y 100

### 3. Modelo Equipo
- **Campos**: nombre, tipo, marca, modelo, numeroSerie, estado, laboratorio, fechaAdquisicion, especificaciones, activo
- **Relación**: Referencia a Laboratorio
- **Estados**: disponible, en_uso, mantenimiento, dañado

### Diagrama de Relaciones

```
Usuario (1) -----> (N) Laboratorio
                       |
                       |
                       v
                   (1) Laboratorio -----> (N) Equipo
```

## Consultas Implementadas

### 1. Listar todos los usuarios
```javascript
const usuarios = await Usuario.find();
```

<img src="https://imgur.com/Ic2DWfe.png" width="300" />

**Endpoint**: `GET /api/consultas/usuarios-todos`

<img src="https://imgur.com/qi5yxsi.png" width="300" />

### 2. Buscar laboratorios que tengan equipos disponibles
```javascript
const equiposDisponibles = await Equipo.find({ estado: 'disponible' })
  .populate('laboratorio')
  .distinct('laboratorio');
```

<img src="https://imgur.com/TBFsmLm.png" width="300" />

**Endpoint**: `GET /api/consultas/laboratorios-equipos-disponibles`

<img src="https://imgur.com/lkfdzeE.png" width="300" />

### 3. Contar cantidad de equipos por estado
```javascript
const conteo = await Equipo.aggregate([
  {
    $group: {
      _id: "$estado",
      cantidad: { $sum: 1 }
    }
  }
]);
```

<img src="https://imgur.com/xPw8u4w.png" width="300" />

**Endpoint**: `GET /api/consultas/equipos-por-estado`

<img src="https://imgur.com/UlxP1EC.png" width="300" />

### 4. Buscar usuarios cuyo correo termine en @universidad.edu
```javascript
const usuarios = await Usuario.find({ 
  correo: { $regex: /@universidad\.edu$/, $options: 'i' }
});
```

<img src="https://imgur.com/mQI0Vkn.png" width="300" />

**Endpoint**: `GET /api/consultas/usuarios-universidad`

<img src="https://imgur.com/b2hk86t.png" width="300" />

### 5. Promedio de equipos por laboratorio usando aggregate
```javascript
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
    $group: {
      _id: null,
      promedioEquipos: { $avg: '$cantidadEquipos' }
    }
  }
]);
```

<img src="https://imgur.com/9Fz7qMX.png" width="300" />

**Endpoint**: `GET /api/consultas/promedio-equipos-laboratorio`

<img src="https://imgur.com/eEqIqmb.png" width="300" />

## Relaciones entre Colecciones

### Relación Usuario → Laboratorio
Implementada mediante referencia directa usando ObjectId:
```javascript
responsable: {
  type: Schema.Types.ObjectId,
  ref: 'Usuario',
  required: true
}
```

### Relación Laboratorio → Equipo
Implementada mediante referencia directa usando ObjectId:
```javascript
laboratorio: {
  type: Schema.Types.ObjectId,
  ref: 'Laboratorio',
  required: true
}
```

### Uso de .populate()
Para obtener datos relacionados se utiliza el método .populate():
```javascript
const laboratorios = await Laboratorio.find().populate('responsable');
const equipos = await Equipo.find().populate('laboratorio');
```

## Instrucciones de Ejecución

### Paso a paso para levantar el entorno

1. **Clonar el repositorio**
```bash
git clone https://github.com/Liseth-Poma/PomaLiseth_Tarea1U2D
cd POMALISETH_TAREA1U2D
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Levantar los contenedores Docker**
```bash
docker-compose up -d
```

4. **Verificar que los servicios estén corriendo**
```bash
docker-compose ps
```

5. **Insertar datos de prueba**
```bash
node seed.js
```

6. **Iniciar el servidor Node.js**
```bash
node index.js
```

### Acceso a los servicios

- **API REST**: http://localhost:8080
- **Mongo Express**: http://localhost:8081
  - Usuario: admin
  - Contraseña: admin123

### Endpoints disponibles

#### CRUD Básico
- `POST /api/usuario` - Crear usuario
- `GET /api/usuarios` - Listar usuarios
- `POST /api/laboratorio` - Crear laboratorio
- `GET /api/laboratorios` - Listar laboratorios
- `POST /api/equipo` - Crear equipo
- `GET /api/equipos` - Listar equipos

#### Consultas Avanzadas
- `GET /api/consultas/usuarios-todos`
- `GET /api/consultas/laboratorios-equipos-disponibles`
- `GET /api/consultas/equipos-por-estado`
- `GET /api/consultas/usuarios-universidad`
- `GET /api/consultas/promedio-equipos-laboratorio`

## Estructura del Proyecto

```
📁 POMALISETH_LAB1U2/
├── 📁 src/
│   ├── 📁 controllers/
│   │   └── 📄 main.controller.js
│   ├── 📁 models/
│   │   ├── 📄 usuario.model.js
│   │   ├── 📄 laboratorio.model.js
│   │   └── 📄 equipo.model.js
│   └── 📁 routes/
│       └── 📄 main.routes.js
├── 📄 docker-compose.yml
├── 📄 index.js
├── 📄 seed.js
├── 📄 package.json
└── 📄 README.md
```

## Análisis Técnico

### Operadores MongoDB Utilizados

1. **$regex**: Para búsquedas con expresiones regulares
```javascript
{ correo: { $regex: /@universidad\.edu$/, $options: 'i' } }
```

2. **$group**: Para agrupar documentos
```javascript
{ $group: { _id: "$estado", cantidad: { $sum: 1 } } }
```

3. **$lookup**: Para realizar joins entre colecciones
```javascript
{
  $lookup: {
    from: 'laboratorios',
    localField: 'laboratorio',
    foreignField: '_id',
    as: 'laboratorioInfo'
  }
}
```

4. **$avg**: Para calcular promedios
```javascript
{ $avg: '$cantidadEquipos' }
```

5. **$in**: Para búsquedas en arrays
```javascript
{ _id: { $in: equiposDisponibles } }
```

### Ventajas del Modelado NoSQL Implementado

1. **Flexibilidad de esquemas**: Los documentos pueden tener estructuras diferentes
2. **Escalabilidad horizontal**: MongoDB maneja grandes volúmenes de datos
3. **Consultas complejas**: Aggregation Framework permite análisis avanzados
4. **Relaciones eficientes**: Referencias y población optimizan consultas

## Conclusiones

Durante el desarrollo de esta práctica se logró:

1. **Implementar con éxito** un sistema de gestión de laboratorios usando MongoDB y Mongoose
2. **Configurar correctamente** el entorno de desarrollo con Docker Compose
3. **Establecer relaciones** entre colecciones usando referencias y el método .populate()
4. **Desarrollar consultas avanzadas** utilizando el Aggregation Framework de MongoDB
5. **Aplicar buenas prácticas** en el modelado de datos NoSQL


## Referencias

1. [Documentación oficial de MongoDB](https://docs.mongodb.com/)
2. [Documentación de Mongoose](https://mongoosejs.com/docs/)
3. [Docker Documentation](https://docs.docker.com/)
4. [Express.js Documentation](https://expressjs.com/)
