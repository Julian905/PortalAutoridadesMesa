// Guardamos los marcadores referenciados por sedeId
const marcadoresPorSede = {};

const mapa = L.map("map").setView([-34.544, -58.712], 14);

L.tileLayer(
   "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    {
        attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20
    }
).addTo(mapa);

// Crear marcadores y guardarlos en el objeto `marcadoresPorSede`
sedes.forEach(sede => {
    const marker = L.marker([sede.latitud, sede.longitud])
        .addTo(mapa)
        .bindPopup(`<strong>${sede.nombre}</strong><br>${sede.direccion}`);

    marcadoresPorSede[sede.id] = marker;
});

sedes.forEach(sede => {
    const marker = L.marker([sede.latitud, sede.longitud])
        .addTo(mapa)
        .bindPopup(`<strong>${sede.nombre}</strong><br>${sede.direccion}`);

    marcadoresPorSede[sede.id] = marker;

    // --- CLIC EN EL MARCADOR (INVERSA) ---
    marker.on("click", () => {
        // 1. Si la lista de charlas está oculta, se muestra
        if (contenedorCharlas.classList.contains("formOculto")) {
            contenedorCharlas.classList.remove("formOculto");
            btnVerCharlas.textContent = "Ocultar charlas disponibles";
        }

        limpiarCharlasSeleccionadas();

        // 2. Quitamos el resaltado previo de cualquier otra tarjeta
        document.querySelectorAll(".charla-item").forEach(card => {
            card.classList.remove("charla-activa");
        });

        // 3. Buscamos y resaltamos la tarjeta asociada a esta sede
        const tarjetaCharla = document.querySelector(`.charla-item[data-sede-id="${sede.id}"]`);

        if (tarjetaCharla) {
            tarjetaCharla.classList.add("charla-activa");

            // 4. Hacemos scroll suave hasta la tarjeta
            tarjetaCharla.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
});
