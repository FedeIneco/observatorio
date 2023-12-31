const mysql = require("mysql");
const dotenv = require("dotenv");
const { query } = require("express");
let instance = null;

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("db " + connection.state);
});

class DbService {
  //TODO: HACER FILTROS.
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData(page) {
    try {
      const pageSize = 25;
      const offset = Math.max(0, (page - 1) * pageSize);
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM `observatorio` WHERE posibleBim = 'posible BIM' ORDER BY `fechaExtraccion` DESC LIMIT ? OFFSET ?";
        connection.query(query, [pageSize, offset], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async getElementById(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM `observatorio` WHERE `id`= ?";
        const values = [id];

        connection.query(query, values, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);

      const response = await new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
          if (err) reject(new Error(err.message));

          const deleteQueryCpv = "DELETE FROM cpv WHERE id_observatorio = ?";
          const deleteQueryObservatorio =
            "DELETE FROM observatorio WHERE id = ?";

          connection.query(deleteQueryCpv, [id], (err, result) => {
            if (err) {
              connection.rollback(() => {
                reject(new Error(err.message));
              });
            }

            connection.query(deleteQueryObservatorio, [id], (err, result) => {
              if (err) {
                connection.rollback(() => {
                  reject(new Error(err.message));
                });
              }

              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    reject(new Error(err.message));
                  });
                }

                resolve(result);
              });
            });
          });
        });
      });
      return response.affectedRows === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateById(
    id,
    sector,
    fase,
    alcanceContrato,
    tipoObra,
    tipoContrato,
    comunidadAutonoma,
    tipoAdministracion,
    ministerio,
    categoriaEdif,
    categoriaInfra
  ) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE extra SET sector = ?, fase = ?, alcanceContrato = ?, tipoObra = ?, tipoContrato = ?, comunidadAutonoma = ?, tipoAdministracion = ?, ministerio = ?, categoriaEdif = ?, categoriaInfra = ? WHERE idLicit = ?";
        connection.query(
          query,
          [
            sector,
            fase,
            alcanceContrato,
            tipoObra,
            tipoContrato,
            comunidadAutonoma,
            tipoAdministracion,
            ministerio,
            categoriaEdif,
            categoriaInfra,
            id,
          ],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      return { success: true, data: response };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async searchByOrgc(name) {
    const response = await new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM `observatorio`  WHERE organoContratacion LIKE CONCAT('%', ?, '%') ORDER BY `fechaExtraccion` DESC";
      connection.query(query, [name], (err, results) => {
        if (err) reject(new Error(err.message));
        resolve(results);
      });
    });
    return response;
  }
  catch(error) {
    console.log(error);
  }
  async filter(filters, page) {
    try {
      const {
        tipoContrato,
        cpv,
        orgContratante,
        ccaa,
        fechaMinima,
        fechaMaxima,
        pbMin,
        pbMax,
        valorMin,
        valorMax,
      } = filters;
      const pageSize = 25;
      const offset = Math.max(0, (page - 1) * pageSize);

      const queryParams = [];
      let queryCondition = "";
      let joinClauses = "";

      if (tipoContrato != "#") {
        queryCondition += "o.tipoContrato LIKE ? AND ";
        queryParams.push(tipoContrato);
      }

      if (orgContratante) {
        queryCondition += "o.organoContratacion LIKE CONCAT('%', ?, '%') AND ";
        queryParams.push(orgContratante);
      }

      if (fechaMinima && fechaMaxima) {
        queryCondition += "o.PrimeraPublicacion BETWEEN ? AND ? AND ";
        queryParams.push(fechaMinima, fechaMaxima);
      }

      if (pbMin && pbMax) {
        queryCondition +=
          "o.presupuestoTax BETWEEN ? AND ? AND ";
        queryParams.push(pbMin, pbMax);
      }

      if (valorMin && valorMax) {
        queryCondition += "o.	valorEstimadoContrato BETWEEN ? AND ? AND ";
        queryParams.push(valorMin, valorMax);
      }

      if (ccaa != "#") {
        joinClauses += "JOIN extra te ON o.id = te.idLicit";
        queryCondition += "te.comunidadAutonoma = ? AND ";
        queryParams.push(ccaa);
      }
      if (cpv) {
        joinClauses += "JOIN cpv tc ON o.id = tc.id_observatorio";
        queryCondition += "tc.cpv_value = ? AND ";
        queryParams.push(cpv);
      }

      if (
        tipoContrato != "#" &&
        !orgContratante &&
        ccaa != "#" &&
        !cpv &&
        !fechaMinima &&
        !fechaMaxima &&
        !pbMin &&
        !pbMax &&
        !valorMin &&
        !valorMax
      ) {
        queryCondition = "1"; // Condición siempre verdadera para seleccionar todo
      } else {
        queryCondition = queryCondition.slice(0, -5); // Recorta la última parte de la condición
      }
      const query = `
      SELECT o.*
      FROM observatorio o
      ${joinClauses}
      WHERE ${queryCondition}
      LIMIT ? OFFSET ?   
    `;
      // console.log(`La query: ${query}`);
      const response = await new Promise((resolve, reject) => {
        connection.query(
          query,
          [...queryParams, pageSize, offset],
          (err, results) => {
            if (err) reject(new Error(err.message));
            resolve(results);
            // console.log(results);
          }
        );
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = DbService;
