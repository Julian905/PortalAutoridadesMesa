function limpiarCharlasSeleccionadas() {
    document.querySelectorAll(".charla-item").forEach(card => {
        card.classList.remove("charla-activa");
    });
}

function mostrarCharlas() {
    const lista = document.getElementById("listaCharlas");
    lista.innerHTML = "";

    charlas.forEach(charla => {
        const sede = sedes.find(sede => sede.id === charla.sedeId);

        const elemento = document.createElement("div");
        elemento.className = "charla-item";
        elemento.dataset.sedeId = charla.sedeId;

        elemento.innerHTML = `
            <h3>${charla.nombre}</h3>
            <p><strong>Tema:</strong> ${charla.tema}</p>
            <p><strong>Fecha:</strong> ${formatearFecha(charla.fecha)}</p>
            <p><strong>Horario:</strong> ${charla.horario}</p>
            <p><strong>Sede:</strong> ${sede.nombre}</p>
            <p><strong>Dirección:</strong> ${sede.direccion}</p>
            <p class="indicador-mapa">📍 Click para ver ubicación en el mapa</p>
        `;

        // Al hacer click en la charla, enfocar la sede en el mapa
        elemento.addEventListener("click", () => {

            limpiarCharlasSeleccionadas();

            // marca la charla seleccionada unicamente
            elemento.classList.add("charla-activa");

            if (sede && marcadoresPorSede[sede.id]) {
                // Centra la vista con animación suave
                mapa.flyTo([sede.latitud, sede.longitud], 16, {
                    duration: 1.2
                });

                // Abre el cartel emergente de la sede
                marcadoresPorSede[sede.id].openPopup();

                // Hace scroll automático hacia el mapa para verlo de inmediato
                document.getElementById("map").scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });

        lista.appendChild(elemento);
    });
}

// Botón para alternar la visibilidad de las charlas
const btnVerCharlas = document.getElementById("boton_ver_charlas");
const contenedorCharlas = document.getElementById("listaCharlas");

btnVerCharlas.addEventListener("click", () => {
    contenedorCharlas.classList.toggle("formOculto");
    
    if (contenedorCharlas.classList.contains("formOculto")) {
        btnVerCharlas.textContent = "Ver charlas disponibles";
    } else {
        btnVerCharlas.textContent = "Ocultar charlas disponibles";
    }
});
function cargarCharlasEnFormulario() {
    const selectorCharla = document.getElementById("charla");

    charlas.forEach(charla => {
        const opcion = document.createElement("option");
        opcion.value = charla.id;
        opcion.textContent = `${charla.nombre} - ${formatearFecha(charla.fecha)} ${charla.horario}`;
        selectorCharla.appendChild(opcion);
    });
}

mostrarCharlas();
cargarCharlasEnFormulario();