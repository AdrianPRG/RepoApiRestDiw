/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let coches = [
  { marca: "Renault", modelo: "Clio" },
  { marca: "Nissan", modelo: "Skyline R34" },
];

let concesionarios = [
  {
    nombre: "Renault",
    direccion: "Avenida de Renault",
    listado: [
      { modelo: "Renault Clio", precio: 19200, cv: 90 },
      { modelo: "Renault Arkana", precio: 29500, cv: 145 },
      { modelo: "Renault Megane E-Tech", precio: 42000, cv: 220 },
    ],
  },
  {
    nombre: "Autos García",
    direccion: "Calle Motor 123",
    listado: [
      { modelo: "Ford Fiesta", precio: 18500, cv: 100 },
      { modelo: "Ford Puma", precio: 28500, cv: 155 },
      { modelo: "Ford Kuga", precio: 35000, cv: 190 },
    ],
  },
  {
    nombre: "Lambo Elite",
    direccion: "Paseo del Lujo 7",
    listado: [
      { modelo: "Lamborghini Huracán EVO", precio: 249000, cv: 640 },
      { modelo: "Lamborghini Aventador SVJ", precio: 450000, cv: 770 },
      { modelo: "Lamborghini Urus", precio: 220000, cv: 650 },
    ],
  },
];

// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});
