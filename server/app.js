const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const dbService = require("./dbService");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//GetAllData
//TODO: Revisar para no perder búsqueda con la paginación
//TODO: Agregar valor de búsqueda para mantenerlo
app.get("/getAll", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const page = request.query.page || 1;  
  const result = db.getAllData(page);
  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

//GetData
app.get("/getDetails/:id", async (request, response) => {
  const elementId = request.params.id;   
  try {
    const db = dbService.getDbServiceInstance();
    const element = await db.getElementById(elementId);    
    if (!element) {
      return response.status(404).json({ message: "Elemento no encontrado" });
    }
    return response.status(200).json(element);
  } catch (error) {
    return response.status(500).json({ message: "Error en el servidor" });
  }
});

//Update
app.patch('/update', async (request, response) => {
  const { id, sector, fase, alcanceContrato, tipoObra, tipoContrato, comunidadAutonoma, tipoAdministracion, ministerio, categoriaEdif, categoriaInfra } = request.body;
  const db = dbService.getDbServiceInstance();

  try {
    const result = await db.updateById(id, sector, fase, alcanceContrato, tipoObra, tipoContrato, comunidadAutonoma, tipoAdministracion, ministerio, categoriaEdif, categoriaInfra);
    response.json({ data: result });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error en el servidor al actualizar el registro." });
  }
});

//Delete
app.delete('/delete/:id', async (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.deleteRowById(id);
  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
})

// //Filter
// app.get('/filter', async (request, response) => {
//   const { 
//     tipoContrato,
//     cpv,
//     orgContratante,
//     ccaa,
//     fechaMinima,
//     fechaMaxima,
//     pbMin,
//     pbMax,
//     valorMax,
//     valorMin, } = request.query;
//     const db = dbService.getDbServiceInstance();
//   try {
//     const filters = {
//       tipoContrato: tipoContrato || undefined,
//       cpv: cpv || undefined,
//       orgContratante: orgContratante || undefined,
//       ccaa: ccaa || undefined,
//       fechaMinima: fechaMinima || undefined,
//       fechaMaxima: fechaMaxima || undefined,
//       pbMin: pbMin ? parseFloat(rangoMin) : undefined,
//       pbMax: pbMax ? parseFloat(rangoMax) : undefined,
//       valorMax: valorMax ? parseFloat(rangoMin) : undefined,
//       valorMin: valorMin ? parseFloat(rangoMax) : undefined
//     };

//     const result = await db.filter(filters);
//     response.json({ data: result });
//   } catch (error) {
//     console.log(error);
//     response.status(500).json({ message: "Error en el servidor al buscar los registros." });
//   }
// });

app.get('/filter', async (request, response) => {
  const {
    tipoContrato,
    cpv, // Cambiado para coincidir con el parámetro en la URL
    orgContratante,
    ccaa,
    fechaMinima,
    fechaMaxima,
    pbMin,
    pbMax,
    valorMax,
    valorMin,
  } = request.query; // Cambiado para capturar parámetros de búsqueda

  const db = dbService.getDbServiceInstance();

  try {
    const result = await db.filter({
      tipoContrato,
      cpv,
      orgContratante,
      ccaa,
      fechaMinima,
      fechaMaxima,
      pbMin,
      pbMax,
      valorMax,
      valorMin,
    }); 
    response.json({ data: result });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Error en el servidor al buscar los registros." });
  }
});


//Search
app.get('/search/:orgc', (request, response) => {
  const { orgc } = request.params;
  const db = dbService.getDbServiceInstance();

  const result =  db.searchByOrgc(orgc);
  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
})



app.listen(process.env.PORT, () => console.log("app is running"));
