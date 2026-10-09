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
        direccion: "Avenida Presidente Juan Domingo Perón 4433, San Miguel, Buenos Aires",
        latitud: -34.543,
        longitud: -58.711
    },
    {
        id: 2,
        nombre: "Centro Cultural",
        direccion: "Peluffo 21, San Miguel, Buenos Aires",
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
        nombre: "Introducción al proceso electoral",
        tema: "Etapas del proceso electoral y organización de los comicios",
        encuentros: [
            {
                id: 1,
                fecha: "2026-10-10",
                horario: "10:00",
                sedeId: 1
            },
            {
                id: 2,
                fecha: "2026-10-11",
                horario: "15:00",
                sedeId: 2
            }
        ]
    },
    {
        id: 2,
        nombre: "Funciones y responsabilidades del presidente de mesa",
        tema: "Responsabilidades antes, durante y después de la votación",
        encuentros: [
            {
                id: 3,
                fecha: "2026-10-10",
                horario: "15:00",
                sedeId: 1
            },
            {
                id: 4,
                fecha: "2026-10-11",
                horario: "10:00",
                sedeId: 2
            }
        ]
    },
    {
        id: 3,
        nombre: "Procedimiento de votación y cierre de mesa",
        tema: "Desarrollo de la votación, escrutinio y cierre",
        encuentros: [
            {
                id: 5,
                fecha: "2026-10-17",
                horario: "10:00",
                sedeId: 1
            },
            {
                id: 6,
                fecha: "2026-10-17",
                horario: "15:00",
                sedeId: 2
            }
        ]
    }
];

const convocatoria = {
    id: 1,
    fechaInicio: "2026-10-10",
    fechaFin: "2026-10-17",
    estado: EstadoConvocatoria.ABIERTA
};

let postulantes =
    JSON.parse(localStorage.getItem("postulantes")) || [];

let solicitudesPostulacion =
    JSON.parse(localStorage.getItem("solicitudesPostulacion")) || [];

function guardarEnLocalStorage() {
    localStorage.setItem(
        "postulantes",
        JSON.stringify(postulantes)
    );

    localStorage.setItem(
        "solicitudesPostulacion",
        JSON.stringify(solicitudesPostulacion)
    );
}

if (!localStorage.getItem("datosEjemploInicializados")) {
    if (postulantes.length === 0 && solicitudesPostulacion.length === 0) {
        postulantes = [
            {
                id: 1001,
                nombre: "Lucía",
                apellido: "Gómez",
                dni: "30111222",
                fechaNacimiento: "1990-04-12",
                direccionActual: "Calle Ficticia 123, San Miguel",
                telefono: "1112345678",
                email: "lucia.gomez@example.com",
                fueAutoridadPreviamente: true,
                cumplioCapacitacion: true,
                esAfiliado: false,
                nombrePartido: ""
            },
            {
                id: 1002,
                nombre: "Mateo",
                apellido: "Pérez",
                dni: "32999888",
                fechaNacimiento: "1988-09-23",
                direccionActual: "Avenida de Prueba 456, José C. Paz",
                telefono: "1123456789",
                email: "mateo.perez@example.com",
                fueAutoridadPreviamente: false,
                cumplioCapacitacion: false,
                esAfiliado: false,
                nombrePartido: ""
            },
            {
                id: 1003,
                nombre: "Sofía",
                apellido: "López",
                dni: "35123456",
                fechaNacimiento: "1995-02-08",
                direccionActual: "Pasaje Demo 789, San Miguel",
                telefono: "1134567890",
                email: "sofia.lopez@example.com",
                fueAutoridadPreviamente: true,
                cumplioCapacitacion: false,
                esAfiliado: true,
                nombrePartido: "Partido de Ejemplo"
            }
        ];

        solicitudesPostulacion = [
            {
                id: 2001,
                fechaRegistro: "2026-10-01",
                estado: EstadoSolicitud.PENDIENTE,
                motivoRechazo: "",
                postulanteId: 1001,
                distritoElectoralId: "1",
                charlaId: 1,
                encuentroId: "1"
            },
            {
                id: 2002,
                fechaRegistro: "2026-10-02",
                estado: EstadoSolicitud.APROBADA,
                motivoRechazo: "",
                postulanteId: 1002,
                distritoElectoralId: "2",
                charlaId: 2,
                encuentroId: "4"
            },
            {
                id: 2003,
                fechaRegistro: "2026-10-03",
                estado: EstadoSolicitud.RECHAZADA,
                motivoRechazo: "",
                postulanteId: 1003,
                distritoElectoralId: "1",
                charlaId: 3,
                encuentroId: "5"
            }
        ];

        guardarEnLocalStorage();
    }

    localStorage.setItem("datosEjemploInicializados", "true");
}

function formatearFecha(fecha) {
    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

const formulario = document.getElementById("formInscripcion");
const btnPostularse = document.getElementById("boton_postularse");
const selectorCharla = document.getElementById("charla");
const campoFechaNacimiento = document.getElementById("fechaNacimiento");
const mensajeInscripcion = document.getElementById("mensaje");
const mensajeEdadInsuficiente =
    "No podés inscribirte porque sos menor de 18 años.";

campoFechaNacimiento.addEventListener("input", () => {
    if (mensajeInscripcion.textContent !== mensajeEdadInsuficiente) {
        return;
    }

    if (calcularEdad(campoFechaNacimiento.value) >= 18) {
        mensajeInscripcion.textContent =
            "Edad válida. Volvé a presionar «Realizar inscripción» para continuar.";
    }
});

function calcularEdad(fechaNacimiento) {
    const [anio, mes, dia] = fechaNacimiento.split("-").map(Number);
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;

    if (
        hoy.getMonth() + 1 < mes ||
        (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)
    ) {
        edad--;
    }

    return edad;
}

btnPostularse.addEventListener("click", () => {
    formulario.classList.toggle("formOculto");
});

function actualizarDatosEncuentro() {
    const encuentroId = selectorCharla.value;
    const charla = charlas.find(item =>
        item.encuentros.some(encuentro =>
            String(encuentro.id) === encuentroId
        )
    );
    const encuentro = charla?.encuentros.find(
        item => String(item.id) === encuentroId
    );
    const sede = encuentro
        ? sedes.find(item => item.id === encuentro.sedeId)
        : null;

    document.getElementById("sedeEncuentro").value =
        sede ? sede.nombre : "";
    document.getElementById("horarioEncuentro").value =
        encuentro ? `${encuentro.horario} hs` : "";
}

selectorCharla.addEventListener("change", actualizarDatosEncuentro);

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const dni = document.getElementById("dni").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const distrito = document.getElementById("distrito").value;
    const mensaje = mensajeInscripcion;

    mensaje.textContent = "";

    if (!/^\d{7,8}$/.test(dni)) {
        mensaje.textContent =
            "El DNI debe contener entre 7 y 8 números.";
        return;
    }

    if (!/^\d{8,15}$/.test(telefono)) {
        mensaje.textContent =
            "El teléfono debe contener entre 8 y 15 números.";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mensaje.textContent =
            "Ingresá un correo electrónico válido.";
        return;
    }

    if (distrito === "") {
        mensaje.textContent =
            "Seleccioná un distrito electoral.";
        return;
    }

    if (calcularEdad(campoFechaNacimiento.value) < 18) {
        mensaje.textContent = mensajeEdadInsuficiente;
        return;
    }

    const postulante = {
        id: Date.now(),
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        dni: dni,
        fechaNacimiento:
            document.getElementById("fechaNacimiento").value,
        direccionActual:
            document.getElementById("direccion").value.trim(),
        telefono: telefono,
        email: email,
        fueAutoridadPreviamente:
            document.getElementById("fueAutoridad").checked,
        cumplioCapacitacion:
            document.getElementById("capacitacion").checked,
        esAfiliado:
            document.getElementById("afiliado").checked,
        nombrePartido:
            document.getElementById("partido").value.trim()
    };

    const encuentroSeleccionadoId =
        document.getElementById("charla").value;

    let charlaSeleccionadaId = null;

    if (encuentroSeleccionadoId) {
        const charlaSeleccionada = charlas.find(charla =>
            charla.encuentros.some(
                encuentro =>
                    String(encuentro.id) === encuentroSeleccionadoId
            )
        );

        charlaSeleccionadaId = charlaSeleccionada
            ? charlaSeleccionada.id
            : null;
    }

    const solicitud = {
        id: Date.now() + 1,
        fechaRegistro: new Date().toISOString().split("T")[0],
        estado: EstadoSolicitud.PENDIENTE,
        motivoRechazo: "",
        postulanteId: postulante.id,
        distritoElectoralId: distrito,
        charlaId: charlaSeleccionadaId,
        encuentroId: encuentroSeleccionadoId || null
    };

    postulantes.push(postulante);
    solicitudesPostulacion.push(solicitud);

    guardarEnLocalStorage();

    mensaje.textContent =
        "¡Inscripción realizada correctamente! La solicitud quedó pendiente de revisión.";

    console.log("Postulante:", postulante);
    console.log("Solicitud:", solicitud);

    formulario.reset();
});

    console.log("Postulante:", postulante);
    console.log("Solicitud:", solicitud);

    formulario.reset();
});
