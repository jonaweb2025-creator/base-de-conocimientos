const fs = require("fs");
const path = require("path");

const carpetaBase = path.join(
    __dirname,
    "..",
    "..",
    "BaseConocimiento"
);


// ==========================================
// PALABRAS QUE NO APORTAN A LA BÚSQUEDA
// ==========================================

const palabrasIgnoradas = new Set([
    "que",
    "qué",
    "como",
    "cómo",
    "de",
    "del",
    "la",
    "las",
    "el",
    "los",
    "una",
    "un",
    "uno",
    "unos",
    "unas",
    "para",
    "por",
    "con",
    "sin",
    "en",
    "es",
    "son",
    "se",
    "su",
    "sus",
    "y",
    "o",
    "a",
    "al",
    "lo",
    "una",
    "debe",
    "tener"
]);


// ==========================================
// EXTRAER SECCIONES MARKDOWN
// ==========================================

function extraerSecciones(contenido) {

    const lineas = contenido.split(/\r?\n/);

    const secciones = [];

    let seccionActual = null;

    for (const linea of lineas) {

        if (/^#{1,6}\s/.test(linea)) {

            if (seccionActual) {
                secciones.push(seccionActual);
            }

            seccionActual = {
                titulo: linea
                    .replace(/^#{1,6}\s/, "")
                    .trim(),

                contenido: linea + "\n"
            };

        } else if (seccionActual) {

            seccionActual.contenido += linea + "\n";
        }
    }

    if (seccionActual) {
        secciones.push(seccionActual);
    }

    return secciones;
}


// ==========================================
// OBTENER TÉRMINOS IMPORTANTES
// ==========================================

function obtenerTerminos(consulta) {

    return consulta
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;:()]/g, "")
        .split(/\s+/)
        .filter(termino =>
            termino.length > 2 &&
            !palabrasIgnoradas.has(termino)
        );
}


// ==========================================
// BUSCADOR
// ==========================================

function buscar(consulta) {

    const terminos = obtenerTerminos(consulta);

    const archivos = fs.readdirSync(carpetaBase);

    const resultados = [];

    archivos.forEach(archivo => {

        if (!archivo.toLowerCase().endsWith(".md")) {
            return;
        }

        const ruta = path.join(
            carpetaBase,
            archivo
        );

        const contenido = fs.readFileSync(
            ruta,
            "utf8"
        );

        const secciones = extraerSecciones(
            contenido
        );

        secciones.forEach(seccion => {

            const titulo = seccion.titulo
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            const texto = seccion.contenido
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            let puntuacion = 0;

            terminos.forEach(termino => {

                // Coincidencia en el título
                if (titulo.includes(termino)) {
                    puntuacion += 3;
                }

                // Coincidencia en el contenido
                if (texto.includes(termino)) {
                    puntuacion += 1;
                }

            });

            if (puntuacion > 0) {

                resultados.push({
                    archivo: archivo,
                    titulo: seccion.titulo,
                    contenido: seccion.contenido.trim(),
                    puntuacion: puntuacion
                });

            }

        });

    });


    // ==========================================
    // ORDENAR RESULTADOS
    // ==========================================

    resultados.sort(
        (a, b) => b.puntuacion - a.puntuacion
    );


    // ==========================================
    // LIMITAR RESULTADOS
    // ==========================================

    return resultados.slice(0, 5);
}


module.exports = {
    buscar
};