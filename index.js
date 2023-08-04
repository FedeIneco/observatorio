let selectedItemId = null;

function selectItem3(event) {
    let dropdownList = document.getElementById('dropdownList3');
    let dropdownItems = dropdownList.getElementsByClassName('dropdown-item');

    // Quita la clase 'selected' de todos los elementos de la lista
    for (let i = 0; i < dropdownItems.length; i++) {
        dropdownItems[i].classList.remove('selected');
    }

    // Agrega la clase 'selected' al elemento seleccionado
    let selectedItem = event.target;
    selectedItem.classList.add('selected');

    // Guarda el ID del elemento seleccionado
    selectedItemId = selectedItem.textContent;
}

function selectItem2(event) {
    let dropdownList = document.getElementById('dropdownList2');
    let dropdownItems = dropdownList.getElementsByClassName('dropdown-item');

    // Quita la clase 'selected' de todos los elementos de la lista
    for (let i = 0; i < dropdownItems.length; i++) {
        dropdownItems[i].classList.remove('selected');
    }

    // Agrega la clase 'selected' al elemento seleccionado
    let selectedItem = event.target;
    selectedItem.classList.add('selected');

    // Guarda el ID del elemento seleccionado
    selectedItemId = selectedItem.textContent;
}


function acceptSelection() {
    if (selectedItemId !== null) {
        // Realiza la acción correspondiente al elemento seleccionado
        // Por ejemplo, puedes acceder al elemento o cargar la pantalla correspondiente
        console.log('Seleccionaste: ' + selectedItemId);
    }

    // Cierra la ventana emergente (modal)
    let modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.parentNode.removeChild(modalOverlay);
}