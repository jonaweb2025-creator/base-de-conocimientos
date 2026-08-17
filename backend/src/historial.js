const fs = require("fs");
const path = require("path");

const ARCHIVO_HISTORIAL = path.join(
    __dirname,
    "..",
    "data",
    "historial.json"
);


// ==========================================
// CREAR ARCHIVO SI NO EXISTE
// ==========================================

function asegurarHistorial() {

    const carpetaData = path.dirname(
        ARCHIVO_HISTORIAL
    );

    if (!fs.existsSync(carpetaData)) {

        fs.mkdirSync(
            carpetaData,
            { recursive: true }
        );
    }

    if (!fs.existsSync(ARCHIVO_HISTORIAL)) {

        fs.writeFileSync(
            ARCHIVO_HISTORIAL,
            "[]",
            "utf8"
        );
    }
}


// ==========================================
// LEER HISTORIAL
// ==========================================

function obtenerHistorial() {

    asegurarHistorial();

    const contenido = fs.readFileSync(
        ARCHIVO_HISTORIAL,
        "utf8"
    );

    return JSON.parse(contenido);
}


// ==========================================
// GUARDAR CONSULTA
// ==========================================

function guardarConsulta({
    pregunta,
    respuesta,
    fuentes
}) {

    const historial = obtenerHistorial();

    const registro = {

        id: Date.now(),

        fecha: new Date().toISOString(),

        pregunta,

        respuesta,

        fuentes: fuentes.map(
            fuente => ({
                archivo: fuente.archivo,
                seccion: fuente.seccion
            })
        )

    };

    historial.push(registro);

    fs.writeFileSync(
        ARCHIVO_HISTORIAL,
        JSON.stringify(
            historial,
            null,
            2
        ),
        "utf8"
    );

    return registro;
}


module.exports = {
    obtenerHistorial,
    guardarConsulta
};