const cpv = document.getElementById("cpv");
const botonFiltro = document.getElementById("filtrar");
const tipoContrato = document.getElementById("tipoContrato");
const orgContratante = document.getElementById("orgContratante");
const nOrgContratacion = document.getElementById("nOrgContratacion");
const ccaa = document.getElementById("comunidadesAutonomasFiltro");
const fechaMinima = document.getElementById("fechaMinima");
const fechaMaxima = document.getElementById("fechaMaxima");
const pbMinimo = document.getElementById("pbMinimo");
const pbMaximo = document.getElementById("pbMaximo");
const valorMinimo = document.getElementById("valorMinimo");
const valorMaximo = document.getElementById("valorMaximo");
let tipo;

fechaMinima.addEventListener("change", function(e) {
    console.log(e.target.value);
});

fechaMaxima.addEventListener("change", function(e) {
    console.log(e.target.value);
});

tipoContrato.addEventListener("change", function (e) {  
  console.log(e.target.value);
});

// botonFiltro.onclick = function () {
//   console.log(cpv.value);
//   console.log(orgContratante.value);
//   console.log(nOrgContratacion.value);
//   console.log(pbMinimo.value);
//   console.log(pbMaximo.value);
//   console.log(valorMinimo.value);
//   console.log(valorMaximo.value);
// };

// botonFiltro.onclick = async function () {

//   const cpvValue = cpv.value;
  
//   fetch("http://localhost:5000/filter", {
//     method: "GET",
//     headers: {
//       "Content-type": "application/json",
//     },
//       body: JSON.stringify({
//       cpv: cpvValue
//     }),
//   }).then((response) => {
//     response.json();  
//   });
// };

 document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    //TODO: MOSTRAR DATOS QUE QUIERAN EN LISTADO

    const form = event.target;
    const formData = new FormData(form);
    
    const searchParams = new URLSearchParams(formData);
    console.log(searchParams.toString());
    const response = await fetch(`http://localhost:5000/filter?${searchParams.toString()}`);
    const data = await response.json();

    console.log(data);

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    if (data.data && data.data.length > 0) {
      data.data.forEach(product => {
        resultsContainer.innerHTML += `<div>ID: ${product.id} - Status: ${product.status} - Tipo Contrato: ${product.tipoContrato}</div>`;
      });
    } else {
      resultsContainer.innerHTML = 'No se encontraron resultados';
    }
  });