// Datos de ejemplo de las charlas
const charlas = [
    {
        nombre: "Charla de orientación 1",
        tema: "Funciones de las autoridades de mesa",
        fecha: "2026-10-10",
        horario: "10:00",
        sede: "Centro Municipal",
        direccion: "San Miguel, Buenos Aires"
    },
    {
        nombre: "Charla de orientación 2",
        tema: "Procedimiento electoral",
        fecha: "2026-10-17",
        horario: "15:00",
        sede: "Centro Cultural",
        direccion: "San Miguel, Buenos Aires"
    }
];


// Mostrar las charlas en la página
function mostrarCharlas() {

    const lista = document.getElementById("listaCharlas");

    lista.innerHTML = "";

    charlas.forEach(charla => {

        const elemento = document.createElement("div");

        elemento.innerHTML = `
            <h3>${charla.nombre}</h3>
            <p><strong>Tema:</strong> ${charla.tema}</p>
            <p><strong>Fecha:</strong> ${charla.fecha}</p>
            <p><strong>Horario:</strong> ${charla.horario}</p>
            <p><strong>Sede:</strong> ${charla.sede}</p>
            <p><strong>Dirección:</strong> ${charla.direccion}</p>
            <hr>
        `;

        lista.appendChild(elemento);
    });
}


// Ejecutar cuando se carga la página
mostrarCharlas();

// Crear el mapa
const mapa = L.map("map").setView(
    [-34.544, -58.712],
    14
);

// Agregar el mapa de OpenStreetMap
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(mapa);

// Agregar las sedes al mapa
const sedes = [
    {
        nombre: "Centro Municipal",
        direccion: "San Miguel, Buenos Aires",
        latitud: -34.543,
        longitud: -58.711
    },
    {
        nombre: "Centro Cultural",
        direccion: "San Miguel, Buenos Aires",
        latitud: -34.545,
        longitud: -58.714
    }
];

sedes.forEach(sede => {

    L.marker([
        sede.latitud,
        sede.longitud
    ])
    .addTo(mapa)
    .bindPopup(`
        <strong>${sede.nombre}</strong><br>
        ${sede.direccion}
    `);

});