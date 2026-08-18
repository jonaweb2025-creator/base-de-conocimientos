const fs = require("fs");
const path = require("path");

// ==========================================
// CONFIGURACIÓN
// ==========================================

const MODELO_EMBEDDING = "nomic-embed-text:latest";

const CARPETA_BASE =
    path.join(__dirname, "..", "..", "BaseConocimiento");

const CARPETA_SALIDA =
    path.join(__dirname, "..", "embeddingsSecciones");


// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(texto) {

    return texto
        .replace(/\r/g, "")
        .trim();

}


// ==========================================
// EXTRAER SECCIONES MARKDOWN
// ==========================================

function extraerSecciones(contenido) {

    const lineas = contenido.split(/\r?\n/);

    const secciones = [];

    let tituloActual = null;
    let nivelActual = null;
    let contenidoActual = [];


    for (const linea of lineas) {

        const coincidencia =
            linea.match(/^(#{1,6})\s+(.+)$/);


        if (coincidencia) {

            // Guardar sección anterior
            if (tituloActual !== null) {

                const texto =
                    normalizarTexto(
                        contenidoActual.join("\n")
                    );

                if (texto.length > 0) {

                    secciones.push({
                        titulo: tituloActual,
                        nivel: nivelActual,
                        contenido: texto
                    });

                }

            }


            nivelActual =
                coincidencia[1].length;

            tituloActual =
                coincidencia[2].trim();

            contenidoActual = [];

        } else if (tituloActual !== null) {

            contenidoActual.push(linea);

        }

    }


    // Guardar última sección
    if (tituloActual !== null) {

        const texto =
            normalizarTexto(
                contenidoActual.join("\n")
            );

        if (texto.length > 0) {

            secciones.push({
                titulo: tituloActual,
                nivel: nivelActual,
                contenido: texto
            });

        }

    }


    return secciones;

}


// ==========================================
// GENERAR EMBEDDING CON OLLAMA
// ==========================================

async function generarEmbedding(texto) {

    const respuesta =
        await fetch(
            "http://localhost:11434/api/embeddings",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: MODELO_EMBEDDING,
                    prompt: texto
                })
            }
        );


    if (!respuesta.ok) {

        throw new Error(
            `Error Ollama: ${respuesta.status}`
        );

    }


    const datos =
        await respuesta.json();


    return datos.embedding;

}


// ==========================================
// PROCESAR BASE DE CONOCIMIENTO
// ==========================================

async function procesarSecciones() {

    // Crear carpeta de salida si no existe
    if (!fs.existsSync(CARPETA_SALIDA)) {

        fs.mkdirSync(
            CARPETA_SALIDA,
            { recursive: true }
        );

    }


    const archivos =
        fs.readdirSync(CARPETA_BASE)
            .filter(
                archivo =>
                    archivo
                        .toLowerCase()
                        .endsWith(".md")
            );


    console.log(
        `Documentos encontrados: ${archivos.length}`
    );


    const registros = [];

    let totalSecciones = 0;


    for (const archivo of archivos) {

        console.log(
            `\nProcesando: ${archivo}`
        );


        const ruta =
            path.join(
                CARPETA_BASE,
                archivo
            );


        const contenido =
            fs.readFileSync(
                ruta,
                "utf8"
            );


        const secciones =
            extraerSecciones(
                contenido
            );


        console.log(
            `Secciones encontradas: ${secciones.length}`
        );


        for (
            let indice = 0;
            indice < secciones.length;
            indice++
        ) {

            const seccion =
                secciones[indice];


            // Para el embedding combinamos
            // título + contenido.
            const textoEmbedding =
                `${seccion.titulo}\n\n${seccion.contenido}`;


            console.log(
                `  → ${indice + 1}/${secciones.length}: ${seccion.titulo}`
            );


            const embedding =
                await generarEmbedding(
                    textoEmbedding
                );


            registros.push({

                id:
                    `${archivo}::${indice + 1}`,

                archivo,

                indiceSeccion:
                    indice + 1,

                nivel:
                    seccion.nivel,

                titulo:
                    seccion.titulo,

                contenido:
                    seccion.contenido,

                embedding

            });


            totalSecciones++;

        }

    }


    // ======================================
    // GUARDAR ÍNDICE COMPLETO
    // ======================================

    const archivoSalida =
        path.join(
            CARPETA_SALIDA,
            "secciones.json"
        );


    fs.writeFileSync(
        archivoSalida,

        JSON.stringify(
            registros,
            null,
            2
        ),

        "utf8"
    );


    console.log(
        "\n================================="
    );

    console.log(
        "EMBEDDINGS POR SECCIÓN COMPLETADOS"
    );

    console.log(
        "================================="
    );

    console.log(
        `Documentos procesados: ${archivos.length}`
    );

    console.log(
        `Secciones procesadas: ${totalSecciones}`
    );

    console.log(
        `Archivo generado: ${archivoSalida}`
    );


    if (registros.length > 0) {

        console.log(
            `Dimensiones: ${registros[0].embedding.length}`
        );

    }

}


// ==========================================
// EJECUTAR
// ==========================================

procesarSecciones()
    .catch(error => {

        console.error(
            "\n❌ ERROR:"
        );

        console.error(
            error.message
        );

    });