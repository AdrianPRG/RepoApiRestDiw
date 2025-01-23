// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8081;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//URL de conexion
const uri =
  "mongodb+srv://alopgal962:a3SUqGNvkvwFZuep@cluster0.bovi8.mongodb.net/Dawebconcesionario?retryWrites=true&w=majority&appName=Cluster0";
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
  },
});

let db;

// Arrancamos la aplicación

app.listen(port, async () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
  try {
    await cliente.connect();
    db = await cliente.db("Dawebconcesionario");
    console.log("Conexión al cliente de MongoDB exitosa.");
  } catch {
    console.log("Error");
  }
});

// Obtener todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  let resultados = await db.collection("Concesionarios").find({}).toArray();
  response.json({ resultados });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  try {
    const id = request.params.id;
    let result = await db
      .collection("Concesionarios")
      .findOne({ _id: new ObjectId(id) });
    response.json({ result });
  } catch {
    response.json("No hay datos que concuerden");
  }
});

// Obtener todos los coches de un concesionario

app.get("/concesionarios/:id/coches", async (request, response) => {
  try {
    const id = request.params.id;
    //Con projection decimos que no aparezca id pero si listado
    let result = await db
      .collection("Concesionarios")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { listado: 1, _id: 0 } }
      );
    response.json({ result });
  } catch {
    response.json("No hay datos que concuerden");
  }
});

//Obtener un coche especifico de un concesionario

app.get("/concesionarios/:id/coches/:id2", async (request, response) => {
  try {
    //Obtenemos los parametros
    const id = request.params.id;
    const id2 = request.params.id2;
    //Con projection decimos que no aparezca id pero si listado, y decimos que encuentra el concesionario con el id deseado
    let result = await db
      .collection("Concesionarios")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { listado: 1, _id: 0 } }
      );
    //obtenemos el coche que queremos segun posicion
    result = result.listado[id2];
    //Devolvemos resultado
    response.json({ result });
  } catch {
    response.json({ message: "No hay datos que concuerden" });
  }
});

// INSERCCION DE DATOS

// Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  try {
    //primero creamos el concesionario
    let concesionario = request.body;
    //A continuacion, transformamos su campo id en tipo de dato de object it
    concesionario._id = new ObjectId(concesionario._id);
    //lo insertamos en la base de datos
    await db.collection("Concesionarios").insertOne(concesionario);
    response.json({ message: "Concesionario añadido con exito" });
  } catch {
    //En caso de error, se nos mostrara el siguiente mensaje
    response.json("No se ha podido crear el concesionario");
  }
});

//Añadir un coche a un concesionario

app.post("/concesionarios/:id/coches", async (request, response) => {
  try {
    let id = request.params.id;
    //Se obtiene el concesionario al que se le desea añadir un coche
    let result = await db
      .collection("Concesionarios")
      .findOne({ _id: new ObjectId(id) });
    //Se añade a su lista el body (cuerpo del json)
    result.listado.push(request.body);
    //A continuacion se actualiza el campo listado, de aquel concesionario que coincida con el id
    //upsert:false es para que no cree un documento nuevo en caso de no encontrar ninguno que coincida
    await db
      .collection("Concesionarios")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { listado: result.listado } },
        { upsert: false }
      );
    //Devolvemos mensaje
    response.json({ message: "Coche insertado cob exito" });
  } catch {
    response.json({ message: "No se ha podido actualizar" });
  }
});

//ACTUALIZACION DE DATOS

// Actualizar un concesionario

app.put("/concesionarios/:id", async (request, response) => {
  try {
    const id = request.params.id;
    //Con replace One actualizamos todo el documento (el concesionario)
    await db
      .collection("Concesionarios")
      .replaceOne({ _id: new ObjectId(id) }, request.body);
    //Devolvemos mensaje de que el concesionario se ha actualizado
    response.json({ message: "Concesionario actualizado" });
  } catch {
    response.json("No es posible actualizar el concesionario");
  }
});

//Actualizar el coche de un concesionario

app.put("/concesionarios/:id/coches/:id2", async (request, response) => {
  try {
    const id = request.params.id;
    const idcoche = request.params.id2;
    //Obtenemos el concesionario que queremos actualizar
    let result = await db
      .collection("Concesionarios")
      .findOne({ _id: new ObjectId(id) });
    //A la lista del concesionario obtenido actualizamos el coche del indice de la lista que el usuario haya pasado por
    //parametros
    result.listado[idcoche] = request.body;
    //Ahora, actualizamos la lista del documento, que contendra su contenido anterior
    //mas el coche actualizado
    await db
      .collection("Concesionarios")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { listado: result.listado } },
        { upsert: false }
      );
    //Devolvemos mensaje de que el coche se ha actualizado
    response.json({ message: "Coche actualizado actualizado" });
  } catch {
    response.json("No es posible actualizar el coche");
  }
});

//ELIMINACION DE DATOS

// Borrar un concensionario

app.delete("/concesionarios/:id", async (request, response) => {
  try {
    const id = request.params.id;
    //Eliminamos el concesinario que coincida con el id
    await db.collection("Concesionarios").deleteOne({ _id: new ObjectId(id) });
    //Devolvemos mensaje de que el concesionario se ha eliminado
    response.json({ message: "Concesionario eliminado" });
  } catch {
    response.json("No es posible eliminar el concesionario");
  }
});

app.delete("/concesionarios/:id/coches/:id2", async (request, response) => {
  try {
    const id = request.params.id;
    const idcoche = request.params.id2;
    //Obtenemos el concesionario del que queremos eliminar
    let concesionario = await db
      .collection("Concesionarios")
      .findOne({ _id: new ObjectId(id) });
    //Eliminamos el coche que coincida con el indice de la lista pasado
    concesionario.listado.splice(idcoche, 1);
    //Actualizamos el concesionario con su nueva lista
    await db
      .collection("Concesionarios")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { listado: concesionario.listado } },
        { upsert: false }
      );

    //Devolvemos mensaje de que el concesionario se ha eliminado
    response.json({ message: "Coche de concesionario eliminado" });
  } catch {
    response.json("No es posible eliminar el coche del concesionario");
  }
});
