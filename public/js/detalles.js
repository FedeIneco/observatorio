// let selectedItemId = null;
const saveButton = document.getElementById("saveButton");

function obtenerParametroId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
obtenerParametroId();

async function cargarDetalles() {
  const elementId = obtenerParametroId();
  
  const response = await fetch(`http://localhost:5000/getDetails/${elementId}`);
  const data = await response.json();
  const datos = data[0];
  
  const idContainer = document.getElementById("idLicitacion");
  const dataContainer = document.getElementById("primeraPubli");
  const tituloLicitacion = document.getElementById("tituloLicitacion");
  const referencia = document.getElementById("referencia");
  const promotor = document.getElementById("promotor");
  const contratos = document.getElementsByName("tipoContrato");
  const bimSi = document.getElementById("bimSi");
  const bimNo = document.getElementById("bimNo");
  const sinIva = document.getElementById("sinIva");
  const linkLic = document.getElementById("linkLic");
  const saveButton = document.getElementById("saveButton");
  const opciones = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (response.ok) {
    saveButton.dataset.id = datos.id;
    const dateOnly = new Date(datos.PrimeraPublicacion)
      .toISOString()
      .split("T")[0];
    const numeroFormateado = datos.presupuestoSinTax.toLocaleString(
      "es",
      opciones
    );
    idContainer.innerHTML = `<p>${datos.id}</p>`;
    dataContainer.innerHTML = `${dateOnly}`;
    tituloLicitacion.innerHTML = datos.objetoContrato;
    referencia.innerText = datos.numeroExp;
    promotor.innerHTML = datos.organoContratacion;
    sinIva.innerText = numeroFormateado + " €";
    if (datos.tipoContrato) {
      for (const contrato of contratos) {
        if (datos.tipoContrato === contrato.value) contrato.checked = true;
        else {
          if (contrato.value === "Otros") contrato.checked = true;
        }
      }
    }
    const bim = datos.posibleBIM;    
    if (bim.includes("posible")) {
      bimSi.checked = true;
    } else {
      bimNo.checked = true;
    }
    linkLic.innerHTML = `<a href= "${datos.urlLicitacion}">${datos.urlLicitacion}</a>`;
  } else {
    // Si el elemento no se encuentra, muestra un mensaje de error
    Swal.fire({
      title: "Error!",
      text: "Algo salió mal",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }
}

saveButton.onclick = function () {
  //TODO: GUARDAR DATOS CUANDO BD ESTÉ COMPLETA
  const estado = "AAA";
   fetch('http://localhost:5000/update', {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: saveButton.dataset.id,
      status: estado
    })
  })
  .then(response => {    
    response.json();
    if(response.status == 200){   
      Swal.fire({
        title: "Éxito",
        text: "Los datos fueron guardados correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });      
    }
  })
};

cargarDetalles();

// function selectItem3(event) {
//     let dropdownList = document.getElementById('dropdownList3');
//     let dropdownItems = dropdownList.getElementsByClassName('dropdown-item');

//     // Quita la clase 'selected' de todos los elementos de la lista
//     for (let i = 0; i < dropdownItems.length; i++) {
//         dropdownItems[i].classList.remove('selected');
//     }

//     // Agrega la clase 'selected' al elemento seleccionado
//     let selectedItem = event.target;
//     selectedItem.classList.add('selected');

//     // Guarda el ID del elemento seleccionado
//     selectedItemId = selectedItem.textContent;
// }

// function selectItem2(event) {
//     let dropdownList = document.getElementById('dropdownList2');
//     let dropdownItems = dropdownList.getElementsByClassName('dropdown-item');

//     // Quita la clase 'selected' de todos los elementos de la lista
//     for (let i = 0; i < dropdownItems.length; i++) {
//         dropdownItems[i].classList.remove('selected');
//     }

//     // Agrega la clase 'selected' al elemento seleccionado
//     let selectedItem = event.target;
//     selectedItem.classList.add('selected');

//     // Guarda el ID del elemento seleccionado
//     selectedItemId = selectedItem.textContent;
// }

// function acceptSelection() {
//     if (selectedItemId !== null) {
//         // Realiza la acción correspondiente al elemento seleccionado
//         // Por ejemplo, puedes acceder al elemento o cargar la pantalla correspondiente
//         console.log('Seleccionaste: ' + selectedItemId);
//     }

//     // Cierra la ventana emergente (modal)
//     let modalOverlay = document.querySelector('.modal-overlay');
//     modalOverlay.parentNode.removeChild(modalOverlay);
// }
