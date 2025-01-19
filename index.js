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
const port = process.env.PORT || 8081;

const { MongoClient, ServerApiVersion } = require('mongodb');

//URL de conexion

const uri = "mongodb+srv://alopgal962:basedaweb962@cluster0.bovi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
//Creamos el cliente con las opcio es de mongoDb del objeto de la api. 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//funcion que se conecta a la base de dats

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //Ponemos aqui el codigo de la api
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
/*
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
*/
//LISTADO Y SELECCION

// Obtener todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  await client.db().collection("").insertOne()
  response.json(concesionarios);
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id];
  response.json({ result });
});

// Obtener todos los coches de un concesionario

app.get("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id]["listado"];
  response.json({ result });
});

//Obtener un coche especifico de un concesionario

app.get("/concesionarios/:id/coches/:id2", (request, response) => {
  const id = request.params.id;
  const id2 = request.params.id2;
  const result = concesionarios[id]["listado"][id2];
  response.json({ result });
});

// INSERCCION DE DATOS

// Añadir un nuevo concesionario
app.post("/concesionarios", (request, response) => {
  concesionarios.push(request.body);
  response.json({ message: "ok" });
});

//Añadir un coche a un concesionario

app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  concesionarios[id]["listado"].push(request.body);
  response.json({ message: "ok" });
});

//ACTUALIZACION DE DATOS

// Actualizar un concesionario

app.put("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios[id] = request.body;
  response.json({ message: "ok" });
});

//Actualizar el coche de un concesionario

app.put("/concesionarios/:id/coches/:id2", (request, response) => {
  const id = request.params.id;
  const idcoche = request.params.id2;
  concesionarios[id]["listado"][idcoche] = request.body;
  response.json({ message: "ok" });
});

//ELIMINACION DE DATOS

// Borrar un concensionario

app.delete("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios.splice(id, 1);

  response.json({ message: "ok" });
});

app.delete("/concesionarios/:id/coches/:id2", (request, response) => {
  const id = request.params.id;
  const idcoche = request.params.id2;
  concesionarios[id]["listado"].splice(idcoche, 1);

  response.json({ message: "ok" });
});
