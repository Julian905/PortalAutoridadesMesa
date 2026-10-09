const btnToggleAdmin = document.getElementById("btnToggleAdmin");
const vistaPostulante = document.getElementById("vistaPostulante");
const vistaAdmin = document.getElementById("vistaAdmin");
const formLoginAdmin = document.getElementById("formLoginAdmin");
const contenidoAdmin = document.getElementById("contenidoAdmin");
const contrasenaAdmin = document.getElementById("contrasenaAdmin");
const mensajeLoginAdmin = document.getElementById("mensajeLoginAdmin");
const contrasenaAdminDemo = "admin123";
let modoAdmin = false;

btnToggleAdmin.addEventListener("click", () => {
    modoAdmin = !modoAdmin;

    if (modoAdmin) {
        vistaPostulante.classList.add("formOculto");
        vistaAdmin.classList.remove("formOculto");
        btnToggleAdmin.textContent = "⬅️ Volver al Portal";
        formLoginAdmin.classList.remove("formOculto");
        contenidoAdmin.classList.add("formOculto");
        contrasenaAdmin.value = "";
        mensajeLoginAdmin.textContent = "";
    } else {
        vistaAdmin.classList.add("formOculto");
        vistaPostulante.classList.remove("formOculto");
        btnToggleAdmin.textContent = "⚙️ Vista Administrador";
        contenidoAdmin.classList.add("formOculto");
        formLoginAdmin.classList.remove("formOculto");
        setTimeout(() => mapa.invalidateSize(), 150);
    }
});

formLoginAdmin.addEventListener("submit", event => {
    event.preventDefault();

    if (contrasenaAdmin.value !== contrasenaAdminDemo) {
        mensajeLoginAdmin.textContent = "La contraseña ingresada es incorrecta.";
        contrasenaAdmin.select();
        return;
    }

    mensajeLoginAdmin.textContent = "";
    formLoginAdmin.classList.add("formOculto");
    contenidoAdmin.classList.remove("formOculto");
    renderizarPostulantesAdmin();
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
