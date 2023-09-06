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

app.get('/filter', async (request, response) => {  
  const page = request.query.page || 1;
  const {
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
  } = request.query; 

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
    }, page); 
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
