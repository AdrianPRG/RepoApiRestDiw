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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

let db;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    db = await client.db("Dawebconcesionario");

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //Ponemos aqui el codigo de la api
  } catch (e){
    // Ensures that the client will close when you finish/error
    console.log(e.pri);
  }
}

run().catch(console.dir);

// Arrancamos la aplicación
app.listen(port, async () => {
   // Send a ping to confirm a successful connection
   console.log(`Servidor desplegado en puerto: ${port}`);
});


// Obtener todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  let resultados = await db.collection("Concesionarios").find({}).toArray();
  response.json(resultados);
});


// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  const id = request.params.id;
  let result = await db.collection("Concesionarios").findOne({"_id": new ObjectId(id)});
  response.json({ result });
});

// Obtener todos los coches de un concesionario

app.get("/concesionarios/:id/coches", async (request, response) => {
  const id = request.params.id;
  //Con projection decimos que no aparezca id pero si listado
  let result = await db.collection("Concesionarios").findOne({"_id": new ObjectId(id)},{projection : {"listado":1, "_id":0}});
  response.json({ result });
});

//Obtener un coche especifico de un concesionario

app.get("/concesionarios/:id/coches/:id2", async (request, response) => {
  const id = request.params.id;
  const id2 = request.params.id2;
  //Con projection decimos que no aparezca id pero si listado
  let result = await db.collection("Concesionarios").findOne({"_id": new ObjectId(id)},{projection : {"listado":1, "_id":0}});
  result = result.listado[id2];
  response.json({ result });
});

/*
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
*/
