const marcadoresPorSede = {};

const mapa = L.map("map").setView([-34.544, -58.712], 14);

L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    {
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20
    }
    ).addTo(mapa);

function mostrarInfoSede(sede) {
    const panel = document.getElementById("panelInfoSede");

    if (!panel) {
        return;
    }

    const encuentrosSede = [];

    charlas.forEach(charla => {
        charla.encuentros.forEach(encuentro => {
            if (encuentro.sedeId === sede.id) {
                encuentrosSede.push({
                    charla,
                    encuentro
                });
            }
        });
    });

    const tarjetas = encuentrosSede.map(({ charla, encuentro }) => `
        <article class="tarjeta-encuentro">
            <h4>${charla.nombre}</h4>
            <p><strong>Tema:</strong> ${charla.tema}</p>
            <p><strong>Fecha:</strong> ${formatearFecha(encuentro.fecha)}</p>
            <p><strong>Horario:</strong> ${encuentro.horario} hs</p>
            <button
                type="button"
                class="boton-seleccionar-encuentro"
                data-encuentro-id="${encuentro.id}">
                Ver este encuentro
            </button>
        </article>
    `).join("");

    panel.innerHTML = `
        <div class="encabezado-sede">
            <h3>${sede.nombre}</h3>
            <p>📍 ${sede.direccion}</p>
        </div>
        <div class="contenido-encuentros">
            <h4 class="titulo-encuentros">
                Charlas disponibles (${encuentrosSede.length})
            </h4>
            ${
                encuentrosSede.length
                    ? tarjetas
                    : '<p class="mensaje-sin-encuentros">No hay encuentros disponibles en esta sede.</p>'
            }
        </div>
    `;

    panel.querySelectorAll(".boton-seleccionar-encuentro").forEach(boton => {
        boton.addEventListener("click", () => {
            const selector = document.getElementById("charla");
            const formulario = document.getElementById("formInscripcion");

            if (selector) {
                selector.value = boton.dataset.encuentroId;
                selector.dispatchEvent(new Event("change"));
            }

            if (formulario) {
                formulario.classList.remove("formOculto");
                formulario.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    });

    document.querySelectorAll(".charla-item").forEach(tarjeta => {
        tarjeta.classList.toggle(
            "charla-activa",
            Number(tarjeta.dataset.sedeId) === sede.id
        );
    });
}

sedes.forEach(sede => {
    const marcador = L.marker([
        sede.latitud,
        sede.longitud
    ]).addTo(mapa);

    marcadoresPorSede[sede.id] = marcador;

    marcador.bindTooltip(sede.nombre);

    marcador.on("click", () => {
        mostrarInfoSede(sede);
    });
});

