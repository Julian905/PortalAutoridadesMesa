const EstadoSolicitud = {
    PENDIENTE: "PENDIENTE",
    APROBADA: "APROBADA",
    RECHAZADA: "RECHAZADA"
};

const EstadoConvocatoria = {
    ABIERTA: "ABIERTA",
    CERRADA: "CERRADA",
    FINALIZADA: "FINALIZADA"
};

const sedes = [
    {
        id: 1,
        nombre: "Centro Municipal",
        direccion: "San Miguel, Buenos Aires",
        latitud: -34.543,
        longitud: -58.711
    },
    {
        id: 2,
        nombre: "Centro Cultural",
        direccion: "San Miguel, Buenos Aires",
        latitud: -34.545,
        longitud: -58.714
    }
];

const distritosElectorales = [
    {
        id: 1,
        codigo: "SM01",
        nombre: "San Miguel"
    },
    {
        id: 2,
        codigo: "SM02",
        nombre: "José C. Paz"
    }
];

const charlas = [
    {
        id: 1,
        nombre: "Charla de orientación 1",
        tema: "Funciones de las autoridades de mesa",
        fecha: "2026-10-10",
        horario: "10:00",
        sedeId: 1
    },
    {
        id: 2,
        nombre: "Charla de orientación 2",
        tema: "Procedimiento electoral",
        fecha: "2026-10-17",
        horario: "15:00",
        sedeId: 2
    }
];

const convocatoria = {
    id: 1,
    fechaInicio: "2026-10-10",
    fechaFin: "2026-10-17",
    estado: EstadoConvocatoria.ABIERTA
};

// Cargar listas desde LocalStorage (o inicializarlas vacías)
let postulantes = JSON.parse(localStorage.getItem("postulantes")) || [];
let solicitudesPostulacion = JSON.parse(localStorage.getItem("solicitudesPostulacion")) || [];

function guardarEnLocalStorage() {
    localStorage.setItem("postulantes", JSON.stringify(postulantes));
    localStorage.setItem("solicitudesPostulacion", JSON.stringify(solicitudesPostulacion));
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function mostrarCharlas() {
    const lista = document.getElementById("listaCharlas");
    lista.innerHTML = "";

    charlas.forEach(charla => {
        const sede = sedes.find(
            sede => sede.id === charla.sedeId
        );

        const elemento = document.createElement("div");
        elemento.innerHTML = `
            <h3>${charla.nombre}</h3>
            <p><strong>Tema:</strong> ${charla.tema}</p>
            <p><strong>Fecha:</strong> ${formatearFecha(charla.fecha)}</p>
            <p><strong>Horario:</strong> ${charla.horario}</p>
            <p><strong>Sede:</strong> ${sede.nombre}</p>
            <p><strong>Dirección:</strong> ${sede.direccion}</p>
            <hr>
        `;
        lista.appendChild(elemento);
    });
}

function cargarCharlasEnFormulario() {
    const selectorCharla = document.getElementById("charla");

    charlas.forEach(charla => {
        const opcion = document.createElement("option");
        opcion.value = charla.id;
        opcion.textContent = `${charla.nombre} - ${formatearFecha(charla.fecha)} ${charla.horario}`;
        selectorCharla.appendChild(opcion);
    });
}

const mapa = L.map("map").setView(
    [-34.544, -58.712],
    14
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(mapa);

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

// Desplegable del formulario de postulación
const formulario = document.getElementById("formInscripcion");
const btnPostularse = document.getElementById("boton_postularse");

btnPostularse.addEventListener("click", () => {
    formulario.classList.toggle("formOculto");
});

formulario.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const dni = document.getElementById("dni").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const email = document.getElementById("email").value.trim();
        const distrito = document.getElementById("distrito").value;
        const mensaje = document.getElementById("mensaje");

        if (!/^\d{7,8}$/.test(dni)) {
            mensaje.textContent = "El DNI debe contener entre 7 y 8 números.";
            return;
        }

        if (!/^\d{8,15}$/.test(telefono)) {
            mensaje.textContent = "El teléfono debe contener entre 8 y 15 números.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mensaje.textContent = "Ingresá un correo electrónico válido.";
            return;
        }

        if (distrito === "") {
            mensaje.textContent = "Seleccioná un distrito electoral.";
            return;
        }

        const postulante = {
            id: Date.now(),
            nombre: document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            dni: dni,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            direccionActual: document.getElementById("direccion").value.trim(),
            telefono: telefono,
            email: email,
            fueAutoridadPreviamente: document.getElementById("fueAutoridad").checked,
            cumplioCapacitacion: document.getElementById("capacitacion").checked,
            esAfiliado: document.getElementById("afiliado").checked,
            nombrePartido: document.getElementById("partido").value.trim()
        };

        postulantes.push(postulante);

        const solicitud = {
            id: Date.now() + 1,
            fechaRegistro: new Date().toISOString().split("T")[0],
            estado: EstadoSolicitud.PENDIENTE,
            motivoRechazo: "",
            postulanteId: postulante.id,
            distritoElectoralId: distrito,
            charlaId: document.getElementById("charla").value || null
        };

        solicitudesPostulacion.push(solicitud);

        // Guardar cambios en el localStorage
        guardarEnLocalStorage();

        mensaje.textContent = "¡Inscripción realizada correctamente! La solicitud quedó pendiente de revisión.";

        console.log("Postulante:", postulante);
        console.log("Solicitud:", solicitud);

        formulario.reset();
    }
);

// --- CAMBIO DE VISTA Y PANEL ADMINISTRADOR ---

const btnToggleAdmin = document.getElementById("btnToggleAdmin");
const vistaPostulante = document.getElementById("vistaPostulante");
const vistaAdmin = document.getElementById("vistaAdmin");
let modoAdmin = false;

btnToggleAdmin.addEventListener("click", () => {
    modoAdmin = !modoAdmin;

    if (modoAdmin) {
        vistaPostulante.classList.add("formOculto");
        vistaAdmin.classList.remove("formOculto");
        btnToggleAdmin.textContent = "⬅️ Volver al Portal";
        renderizarPostulantesAdmin();
    } else {
        vistaAdmin.classList.add("formOculto");
        vistaPostulante.classList.remove("formOculto");
        btnToggleAdmin.textContent = "⚙️ Vista Administrador";
        setTimeout(() => mapa.invalidateSize(), 150);
    }
});

function renderizarPostulantesAdmin() {
    const contenedor = document.getElementById("contenedorPostulantes");

    if (postulantes.length === 0) {
        contenedor.innerHTML = "<p>No hay postulantes registrados todavía.</p>";
        return;
    }

    contenedor.innerHTML = "";

    postulantes.forEach(postulante => {
        const solicitud = solicitudesPostulacion.find(s => s.postulanteId === postulante.id) || {
            estado: EstadoSolicitud.PENDIENTE,
            distritoElectoralId: null
        };

        const distrito = distritosElectorales.find(d => d.id === Number(solicitud.distritoElectoralId));
        const nombreDistrito = distrito ? distrito.nombre : "No especificado";

        let badgeClass = "badge-pendiente";
        if (solicitud.estado === EstadoSolicitud.APROBADA) badgeClass = "badge-aprobada";
        if (solicitud.estado === EstadoSolicitud.RECHAZADA) badgeClass = "badge-rechazada";

        const card = document.createElement("div");
        card.className = "postulante-card";
        card.innerHTML = `
            <h3>
                <span>${postulante.apellido}, ${postulante.nombre}</span>
                <span class="badge ${badgeClass}">${solicitud.estado}</span>
            </h3>
            <p><strong>DNI:</strong> ${postulante.dni} | <strong>Nacimiento:</strong> ${formatearFecha(postulante.fechaNacimiento)}</p>
            <p><strong>Email:</strong> ${postulante.email} | <strong>Teléfono:</strong> ${postulante.telefono}</p>
            <p><strong>Dirección:</strong> ${postulante.direccionActual} | <strong>Distrito:</strong> ${nombreDistrito}</p>
            <p><strong>Experiencia previa:</strong> ${postulante.fueAutoridadPreviamente ? "Sí" : "No"} | <strong>Capacitación:</strong> ${postulante.cumplioCapacitacion ? "Sí" : "No"}</p>
            <p><strong>Afiliado:</strong> ${postulante.esAfiliado ? `Sí (${postulante.nombrePartido || "Sin partido"})` : "No"}</p>
            
            <div class="acciones-admin">
                <button class="btn-aprobar" onclick="actualizarEstadoSolicitud(${postulante.id}, '${EstadoSolicitud.APROBADA}')">Aprobar</button>
                <button class="btn-rechazar" onclick="actualizarEstadoSolicitud(${postulante.id}, '${EstadoSolicitud.RECHAZADA}')">Rechazar</button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Función global accesible para los botones dentro de cada card
window.actualizarEstadoSolicitud = function(postulanteId, nuevoEstado) {
    const solicitud = solicitudesPostulacion.find(s => s.postulanteId === postulanteId);
    if (solicitud) {
        solicitud.estado = nuevoEstado;
        guardarEnLocalStorage();
        renderizarPostulantesAdmin();
    }
};

mostrarCharlas();
cargarCharlasEnFormulario();