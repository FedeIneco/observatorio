const searchButton = document.getElementById("buscar");
document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;

  function loadData(page) {
    fetch(`http://localhost:5000/getAll?page=${page}`)
      .then((response) => response.json())
      .then((data) => loadTable(data["data"]));
  }
  if (currentPage === 1) {
    document.getElementById("prev").style.visibility = "hidden";
  }
  document.getElementById("prev").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      loadData(currentPage);
      document.getElementById("next").style.visibility = "visible";
    }

    if (currentPage === 1) {
      document.getElementById("prev").style.visibility = "hidden";
    }
  });

  document.getElementById("next").addEventListener("click", function () {
    currentPage++;
    loadData(currentPage);

    document.getElementById("prev").style.visibility = "visible";
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
  const opciones = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

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
    const numeroFormateado = valorEstimadoContrato.toLocaleString(
      "es",
      opciones
    );
    const fechaOriginal = new Date(PrimeraPublicacion);
    const dia = fechaOriginal.getDate().toString().padStart(2, "0");
    const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaOriginal.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${fechaFormateada}</td>`;
    tableHtml += `<td>${numeroExp}</td>`;
    tableHtml += `<td>${status}</td>`;
    tableHtml += `<td>${objetoContrato}</td>`;
    tableHtml += `<td>${tipoContrato}</td>`;
    tableHtml += `<td>${numeroFormateado} €</td>`;
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

searchButton.onclick = function () {
  const searchValue = document.getElementById("buscador").value;
  if (searchValue.trim() !== "") {
    fetch(`http://localhost:5000/search/` + searchValue)
      .then((response) => response.json())
      .then((data) => loadTable(data["data"]));
  } else {
    Swal.fire({
      title: '¡Aviso!',
      text: 'Rellene el campo de búsqueda',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });    
  }
};
