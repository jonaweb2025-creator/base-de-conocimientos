const fs = require("fs");
const path = require("path");

const {
    buscarSemantico
} = require("./buscadorSemantico");

// ==========================================
// CONFIGURACIÓN
// ==========================================

const CARPETA_BASE =
    path.join(__dirname, "..", "..", "BaseConocimiento");

// Cantidad máxima de documentos candidatos
const LIMITE_DOCUMENTOS = 6;

// Cantidad máxima de fuentes finales
const LIMITE_FUENTES = 4;


// ==========================================
// EXTRAER SECCIONES
// ==========================================

function extraerSecciones(contenido) {

    const lineas = contenido.split("\n");

    const secciones = [];

    let seccionActual = null;
    let contenidoActual = [];

    for (const linea of lineas) {

        if (linea.startsWith("#")) {

            // Guardar sección anterior
            if (seccionActual !== null) {

                secciones.push({

                    titulo: seccionActual,

                    contenido:
                        contenidoActual
                            .join("\n")
                            .trim()

                });

            }

            // Crear nueva sección
            seccionActual =
                linea
                    .replace(/^#+\s*/, "")
                    .trim();

            contenidoActual = [];

        } else {

            contenidoActual.push(linea);

        }

    }


    // Guardar última sección
    if (seccionActual !== null) {

        secciones.push({

            titulo: seccionActual,

            contenido:
                contenidoActual
                    .join("\n")
                    .trim()

        });

    }


    return secciones;

}


// ==========================================
// CALCULAR RELEVANCIA DE UNA SECCIÓN
// ==========================================

function calcularRelevancia(
    seccion,
    pregunta
) {

    const texto =
        (
            seccion.titulo +
            " " +
            seccion.contenido
        ).toLowerCase();


    const palabras =
        pregunta
            .toLowerCase()
            .replace(/[¿?¡!.,;:()]/g, "")
            .split(/\s+/)
            .filter(
                palabra =>
                    palabra.length > 3
            );


    let puntuacion = 0;


    for (const palabra of palabras) {

        if (texto.includes(palabra)) {

            puntuacion++;

        }

    }


    // ======================================
    // BONIFICAR COINCIDENCIA EN EL TÍTULO
    // ======================================

    const titulo =
        seccion.titulo.toLowerCase();


    for (const palabra of palabras) {

        if (titulo.includes(palabra)) {

            puntuacion += 2;

        }

    }


    return puntuacion;

}


// ==========================================
// CONSTRUIR CONTEXTO
// ==========================================

async function construirContexto(
    pregunta
) {

    


    // ======================================
    // 1. BÚSQUEDA SEMÁNTICA
    // ======================================

    const documentos =
        await buscarSemantico(
            pregunta,
            LIMITE_DOCUMENTOS
        );


    const fuentes = [];


    // ======================================
    // 2. ANALIZAR CADA DOCUMENTO
    // ======================================

    for (const documento of documentos) {

        const ruta =
            path.join(
                CARPETA_BASE,
                documento.archivo
            );


        if (!fs.existsSync(ruta)) {

            continue;

        }


        const contenido =
            fs.readFileSync(
                ruta,
                "utf8"
            );


        const secciones =
            extraerSecciones(
                contenido
            );


        // ==================================
        // ANALIZAR TODAS LAS SECCIONES
        // ==================================

        for (const seccion of secciones) {

            const puntuacion =
                calcularRelevancia(
                    seccion,
                    pregunta
                );


            if (documento.puntuacion >= 0.60) {

                fuentes.push({

                    archivo:
                        documento.archivo,

                    seccion:
                        seccion.titulo,

                    contenido:
                        seccion.contenido,

                    similitud:
                        documento.puntuacion,

                    puntuacion

                });

            }

        }

    }


    // ==========================================
    // 3. ORDENAR TODAS LAS FUENTES
    // ==========================================

    fuentes.sort(
        (a, b) => {

            // Primero relevancia de sección
            if (
                b.puntuacion !==
                a.puntuacion
            ) {

                return (
                    b.puntuacion -
                    a.puntuacion
                );

            }


            // Después similitud semántica
            return (
                b.similitud -
                a.similitud
            );

        }
    );


    // ==========================================
    // 4. LIMITAR CONTEXTO
    // ==========================================

    const fuentesFinales =
        fuentes.slice(
            0,
            LIMITE_FUENTES
        );


    return fuentesFinales;

}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    construirContexto

};