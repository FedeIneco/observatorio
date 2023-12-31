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
  const sinIva = document.getElementById("sinIva");
  const linkLic = document.getElementById("linkLic");
  const saveButton = document.getElementById("saveButton");
  const opciones = {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (response.ok) {
    const fechaOriginal = new Date(datos.PrimeraPublicacion);
    const dia = fechaOriginal.getDate().toString().padStart(2, "0");
    const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaOriginal.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;
    saveButton.dataset.id = datos.id;
    const numeroFormateado = datos.presupuestoSinTax.toLocaleString(
      "es",
      opciones
    );
    idContainer.innerHTML = `<p>${datos.id}</p>`;
    dataContainer.innerHTML = `${fechaFormateada}`;
    tituloLicitacion.innerHTML = datos.objetoContrato;
    referencia.innerText = datos.numeroExp;
    promotor.innerHTML = datos.organoContratacion;
    sinIva.innerText = numeroFormateado + " €";
    if (datos.tipoContrato) {
      for (const contrato of contratos) {
        if (datos.tipoContrato === contrato.value) {
          contrato.checked = true;
          break;
        }
      }
    }
    // const bim = datos.posibleBIM;
    // if (bim.includes("posible")) {
    //   bimSi.checked = true;
    // } else {
    //   bimNo.checked = true;
    // }
    linkLic.innerHTML = `<a href= "${datos.urlLicitacion}">${datos.urlLicitacion}</a>`;
  } else {
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
  const bim = document.getElementsByName("bim");
  const sectorLicitacion = document.getElementsByName("sectorLicitacion");
  const tipoLicitacion = document.getElementsByName("tipoLicitacion");
  const tipoContrato = document.getElementsByName("tipoContrato");
  const ccaa = document.getElementsByName("ccaa");
  const admon = document.getElementsByName("admon");
  const ministerios = document.getElementsByName("ministerios");
  const categoriaEdif = document.getElementsByName("categoriaEdif");
  const infra = document.getElementsByName("infra");
  const fase = document.querySelectorAll('input[type="checkbox"][name^="fase"]');
  const alcanceContrato = document.querySelectorAll('input[type="checkbox"][name^="contrato"]');
  
  const dataSector = checkedRadioButton(sectorLicitacion);
  const dataFase = checkedCheckoxes(fase);
  const dataAlcanceContrato = checkedCheckoxes(alcanceContrato);
  const dataTipoObra = checkedRadioButton(tipoLicitacion);
  const dataTipoContrato = checkedRadioButton(tipoContrato);
  const dataCcaa = checkedRadioButton(ccaa);
  const dataAdmon = checkedRadioButton(admon);
  const dataMinisterios = checkedRadioButton(ministerios);
  const dataEdif = checkedRadioButton(categoriaEdif);
  const dataInfra = checkedRadioButton(infra);
  console.log(checkedRadioButton(bim));
  
  fetch("http://localhost:5000/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
      body: JSON.stringify({
      id: saveButton.dataset.id,
      sector: dataSector,
      fase : JSON.stringify(dataFase),
      alcanceContrato : JSON.stringify(dataAlcanceContrato),
      tipoObra: dataTipoObra,
      tipoContrato: dataTipoContrato,
      comunidadAutonoma: dataCcaa,
      tipoAdministracion : dataAdmon,
      ministerio : dataMinisterios,
      categoriaEdif : dataEdif,
      categoriaInfra : dataInfra
    }),
  }).then((response) => {
    response.json();
    if (response.status == 200) {
      Swal.fire({
        title: "Éxito",
        text: "Los datos fueron guardados correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    }
  });
};

function checkedRadioButton(radioButtons) {
  let selectedValue = null;
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      break;
    }
  }

  if (selectedValue !== null) {
    console.log("Radio button seleccionado:", selectedValue);
  } else {
    console.log("Ningún radio button seleccionado");
  }
  return selectedValue;
}

function checkedCheckoxes(checkboxes) {
  let selectedValues = [];
  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      selectedValues.push(checkbox.value);
    }
  }
  
  if (selectedValues.length > 0) {
    console.log("Checkboxes marcados:", selectedValues);
  } else {
    console.log("Ningún checkbox marcado");
  }
  return selectedValues;
}
cargarDetalles();
