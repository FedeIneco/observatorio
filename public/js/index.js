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
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const buttons = document.querySelector(".buttons");
let searchParams = new URLSearchParams();
let currentPage = 1;
buttons.style.visibility = "hidden";

document
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    currentPage = 1
    event.preventDefault();
    //TODO: MOSTRAR DATOS QUE QUIERAN EN LISTADO
    const form = event.target;
    const formData = new FormData(form);

    searchParams = new URLSearchParams(formData);
    const response = await fetch(
      `http://localhost:5000/filter?${searchParams.toString()}?&page=${currentPage}`
    );
    console.log(`http://localhost:5000/filter?${searchParams.toString()}?/page=${currentPage}`);
    const data = await response.json();
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "";

    if(data.data.length < 25){
      buttons.style.visibility = "hidden";
    }else{
       buttons.style.visibility = "visible";
    }
    if (data.data && data.data.length > 0) {
      data.data.forEach((product) => {
        resultsContainer.innerHTML += `<div>ID: ${product.id} - Status: ${product.status} - Tipo Contrato: ${product.tipoContrato}</div>`;
      });
    } else {
      resultsContainer.innerHTML = "No se encontraron resultados";
    }
  });
  
if (currentPage === 1) {
  prevButton.style.visibility = "hidden";
}
prevButton.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
     loadData(currentPage, searchParams);
    nextButton.style.visibility = "visible";
  }

  if (currentPage === 1) {
    prevButton.style.visibility = "hidden";
  }
});

nextButton.addEventListener("click", function () {
  currentPage++;
  loadData(currentPage, searchParams);

  prevButton.style.visibility = "visible";
});


async function loadData(currentPage, searchParams){
  const response = await fetch(
    `http://localhost:5000/filter?${searchParams.toString()}?&page=${currentPage}`
  );
  console.log(`http://localhost:5000/filter?${searchParams.toString()}?&page=${currentPage}`);
  // console.log(currentPage);
  const data = await response.json();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  if (data.data && data.data.length > 0) {
    data.data.forEach((product) => {
      resultsContainer.innerHTML += `<div>ID: ${product.id} - Status: ${product.status} - Tipo Contrato: ${product.tipoContrato}</div>`;
    });
  } else {
    resultsContainer.innerHTML = "No se encontraron resultados";
  }
}

// function loadData(currentPage){
//   document
//     .getElementById("searchForm")
//     .addEventListener("submit", async (event) => {
//       event.preventDefault();
//       //TODO: MOSTRAR DATOS QUE QUIERAN EN LISTADO
//       const form = event.target;
//       const formData = new FormData(form);
  
//       const searchParams = new URLSearchParams(formData);
//       const response = await fetch(
//         `http://localhost:5000/filter?${searchParams.toString()}?page=${currentPage}`
//       );
//       const data = await response.json();
//       const resultsContainer = document.getElementById("results");
//       resultsContainer.innerHTML = "";
  
//       if (!flag) {
//         if (data.data.length <= 25) {
//           buttons.style.visibility = "hidden";
//         } else {
//           buttons.style.visibility = "visible";
//         }
//         flag = true; // Establecer la variable de bandera a true
//       }
//       if (data.data && data.data.length > 0) {
//         data.data.forEach((product) => {
//           resultsContainer.innerHTML += `<div>ID: ${product.id} - Status: ${product.status} - Tipo Contrato: ${product.tipoContrato}</div>`;
//         });
//       } else {
//         resultsContainer.innerHTML = "No se encontraron resultados";
//       }
//     });
//   }
    
//   if (currentPage === 1) {
//     prevButton.style.visibility = "hidden";
//   }
//   prevButton.addEventListener("click", function () {
//     if (currentPage > 1) {
//       currentPage--;
//       loadData(currentPage);
//       nextButton.style.visibility = "visible";
//     }
  
//     if (currentPage === 1) {
//       prevButton.style.visibility = "hidden";
//     }
//   });
  
//   nextButton.addEventListener("click", function () {
//     currentPage++;
//     loadData(currentPage);
  
//     prevButton.style.visibility = "visible";
//     loadData(currentPage)
//   });