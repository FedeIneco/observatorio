const searchButton = document.getElementById('buscar');
document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;

  function loadData(page) {
    fetch(`http://localhost:5000/getAll?page=${page}`)
      .then((response) => response.json())
      .then((data) => loadTable(data["data"]));
  }
  if (currentPage === 1) {
    document.getElementById("prev").style.visibility = "hidden"; // Ocultar el botón "prev" si estamos en la primera página
  }
  document.getElementById("prev").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      loadData(currentPage);
      document.getElementById("next").style.visibility = "visible"; // Hacer visible el botón "next"
    }

    if (currentPage === 1) {
      document.getElementById("prev").style.visibility = "hidden"; // Ocultar el botón "prev" si estamos en la primera página
    }
  });

  document.getElementById("next").addEventListener("click", function () {
    currentPage++;
    loadData(currentPage);

    document.getElementById("prev").style.visibility = "visible"; // Hacer visible el botón "prev"
  });

  loadData(currentPage);
});

document
  .querySelector("table tbody")
  .addEventListener("click", function (event) {
    if (event.target.className === "editar-licitacion") {
      editRowById(event.target.dataset.id);
    }
    if (event.target.className === "borrar-licitacion") {
      deleteRowById(event.target.dataset.id);
    }
  });

function loadTable(data) {
  const table = document.querySelector("table tbody");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan = '9'>No Data</td></tr>";
  }

  let tableHtml = "";
  data.forEach(function ({
    id,
    PrimeraPublicacion,
    numeroExp,
    status,
    objetoContrato,
    tipoContrato,
    valorEstimadoContrato,
    organoContratacion,
  }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${
      new Date(PrimeraPublicacion).toISOString().split("T")[0]
    }</td>`;
    tableHtml += `<td>${numeroExp}</td>`;
    tableHtml += `<td>${status}</td>`;
    tableHtml += `<td>${objetoContrato}</td>`;
    tableHtml += `<td>${tipoContrato}</td>`;
    tableHtml += `<td>${valorEstimadoContrato}</td>`;
    tableHtml += `<td>${organoContratacion}</td>`;
    tableHtml += `<td><button class="editar-licitacion" data-id=${id}>Editar</button></td>`;
    tableHtml += `<td><button class="borrar-licitacion" data-id=${id}>Borrar</button></td>`;
    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}

function editRowById(id) {
  window.location.href = `detalles.html?id=${id}`;
}

function deleteRowById(id) {
  Swal.fire({
    title: "¿Deseas borrar los datos?",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: `No`,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:5000/delete/` + id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Éxito",
              text: "Los datos fueron borrados correctamente",
              icon: "success",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) location.reload();
            });
          }
        });
    } else if (result.isDenied) {
      Swal.fire("No se borraron los datos", "", "info");
    }
  });
}

searchButton.onclick = function(){
    const searchValue = document.getElementById('buscador').value;
    fetch(`http://localhost:5000/search/` + searchValue)
    .then((response) => response.json())
    .then((data) => loadTable(data["data"]));
}