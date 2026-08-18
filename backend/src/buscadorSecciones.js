const fs = require("fs");
const path = require("path");

// ==========================================
// CONFIGURACIÓN
// ==========================================

const MODELO_EMBEDDING = "nomic-embed-text:latest";

const ARCHIVO_SECCIONES =
    path.join(
        __dirname,
        "..",
        "embeddingsSecciones",
        "secciones.json"
    );


// ==========================================
// GENERAR EMBEDDING DE LA PREGUNTA
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
// SIMILITUD COSENO
// ==========================================

function similitudCoseno(
    vectorA,
    vectorB
) {

    let producto = 0;
    let magnitudA = 0;
    let magnitudB = 0;

    for (
        let i = 0;
        i < vectorA.length;
        i++
    ) {

        producto +=
            vectorA[i] *
            vectorB[i];

        magnitudA +=
            vectorA[i] *
            vectorA[i];

        magnitudB +=
            vectorB[i] *
            vectorB[i];
    }

    magnitudA =
        Math.sqrt(magnitudA);

    magnitudB =
        Math.sqrt(magnitudB);

    if (
        magnitudA === 0 ||
        magnitudB === 0
    ) {
        return 0;
    }

    return (
        producto /
        (magnitudA * magnitudB)
    );
}


// ==========================================
// BUSCAR SECCIONES
// ==========================================

async function buscarSecciones(
    pregunta,
    limite = 5
) {

    if (!fs.existsSync(ARCHIVO_SECCIONES)) {

        throw new Error(
            "No existe embeddingsSecciones/secciones.json. Ejecuta primero embeddingsSecciones.js."
        );
    }

    const secciones =
        JSON.parse(
            fs.readFileSync(
                ARCHIVO_SECCIONES,
                "utf8"
            )
        );

    const embeddingPregunta =
        await generarEmbedding(
            pregunta
        );

    const resultados =
        secciones.map(
            seccion => {

                const similitud =
                    similitudCoseno(
                        embeddingPregunta,
                        seccion.embedding
                    );

                return {

                    archivo:
                        seccion.archivo,

                    seccion:
                        seccion.titulo,

                    contenido:
                        seccion.contenido,

                    similitud

                };
            }
        );

    resultados.sort(
        (a, b) =>
            b.similitud -
            a.similitud
    );

    return resultados.slice(
        0,
        limite
    );
}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    buscarSecciones
};