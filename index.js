// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8081;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//URL de conexion
const uri = "mongodb+srv://alopgal962:a3SUqGNvkvwFZuep@cluster0.bovi8.mongodb.net/Dawebconcesionario?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API versio
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

//Creamos el cliente con las opcio es de mongoDb del objeto de la api. 
const cliente = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});


let db;

// Arrancamos la aplicación

app.listen(port, async () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
  try{
    await cliente.connect();
    db = await cliente.db("Dawebconcesionario");
    console.log("Conexión al cliente de MongoDB exitosa.");
  }catch{
    console.log("Error");
  }
});


// Obtener todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  let resultados = await db.collection("Concesionarios").find({}).toArray();
  response.json(resultados);
});


// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  try{
    const id = request.params.id;
    let result = await db.collection("Concesionarios").findOne({"_id": new ObjectId(id)});
    response.json({ result });
  }catch{
    response.json("No hay datos que concuerden");
  }
});

// Obtener todos los coches de un concesionario

app.get("/concesionarios/:id/coches", async (request, response) => {
    try{
        const id = request.params.id;
      //Con projection decimos que no aparezca id pero si listado
      let result = await db.collection("Concesionarios").findOne({"_id": new ObjectId(id)},{projection : {"listado":1, "_id":0}});
      response.json({ result });
    }catch{
      response.json("No hay datos que concuerden");
    }
});

//Obtener un coche especifico de un concesionario

app.get("/concesionarios/:id/coches/:id2", async (request, response) => {
  try{
      const id = request.params.id;
    const id2 = request.params.id2;
    //Con projection decimos que no aparezca id pero si listado
    let result = await db.collection("Concesionarios").findOne({"_id": new ObjectId(id)},{projection : {"listado":1, "_id":0}});
    result = result.listado[id2];
    response.json({ result });
  }
  catch{
    response.json("No hay datos que concuerden");
  }
});


/*
// INSERCCION DE DATOS

// Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  await db.collection("Concesionarios").insertOne(request.body);
  response.json({ message: "Concesionario añadido con exito" });
});

//Añadir un coche a un concesionario

app.post("/concesionarios/:id/coches", async (request, response) => {
  let id = request.params.id;
  let concesionario =  await db.collection("Concesionarios").findOneAndUpdate({"_id": new ObjectId(id)},{"listado":request.body});
  response.json({ message: "ok" });
});


/*


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
