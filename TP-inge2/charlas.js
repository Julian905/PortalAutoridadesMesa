function limpiarCharlasSeleccionadas() {
    document.querySelectorAll(".charla-item").forEach(tarjeta => {
        tarjeta.classList.remove("charla-activa");
    });
}

function mostrarCharlas() {
    const lista = document.getElementById("listaCharlas");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    charlas.forEach(charla => {
        charla.encuentros.forEach(encuentro => {
            const sede = sedes.find(
                item => item.id === encuentro.sedeId
            );

            if (!sede) {
                return;
            }

            const tarjeta = document.createElement("div");

            tarjeta.className = "charla-item";
            tarjeta.dataset.charlaId = charla.id;
            tarjeta.dataset.encuentroId = encuentro.id;
            tarjeta.dataset.sedeId = sede.id;

            tarjeta.innerHTML = `
                <h3>${charla.nombre}</h3>
                <p><strong>Tema:</strong> ${charla.tema}</p>
                <p><strong>Fecha:</strong> ${formatearFecha(encuentro.fecha)}</p>
                <p><strong>Horario:</strong> ${encuentro.horario} hs</p>
                <p><strong>Sede:</strong> ${sede.nombre}</p>
                <p><strong>Dirección:</strong> ${sede.direccion}</p>
            `;

            tarjeta.addEventListener("click", () => {
                limpiarCharlasSeleccionadas();
                tarjeta.classList.add("charla-activa");

                if (typeof mapa !== "undefined") {
                    mapa.flyTo(
                        [sede.latitud, sede.longitud],
                        16
                    );
                }

                if (typeof mostrarInfoSede === "function") {
                    mostrarInfoSede(sede);
                }

                const mapaElemento = document.getElementById("map");

                if (mapaElemento) {
                    mapaElemento.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            });

            lista.appendChild(tarjeta);
        });
    });
}

function cargarCharlasEnFormulario() {
    const selector = document.getElementById("charla");

    if (!selector) {
        return;
    }

    selector.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "No deseo participar de una charla";

    selector.appendChild(opcionInicial);

    charlas.forEach(charla => {
        charla.encuentros.forEach(encuentro => {
            const sede = sedes.find(
                item => item.id === encuentro.sedeId
            );

            if (!sede) {
                return;
            }

            const opcion = document.createElement("option");

            opcion.value = encuentro.id;
            opcion.textContent =
                `${charla.nombre} — ` +
                `${formatearFecha(encuentro.fecha)} ` +
                `${encuentro.horario} hs — ` +
                `${sede.nombre}`;

            selector.appendChild(opcion);
        });
    });
}

mostrarCharlas();
cargarCharlasEnFormulario();
