const fs = require("fs");
const path = require("path");

// ==========================================
// CONFIGURACIÓN
// ==========================================

const MODELO_EMBEDDING = "nomic-embed-text:latest";

const CARPETA_EMBEDDINGS =
    path.join(__dirname, "..", "embeddings");


// ==========================================
// GENERAR EMBEDDING DE LA CONSULTA
// ==========================================

async function generarEmbedding(texto) {

    const respuesta = await fetch(
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

    const datos = await respuesta.json();

    return datos.embedding;
}


// ==========================================
// SIMILITUD COSENO
// ==========================================

function similitudCoseno(vectorA, vectorB) {

    let producto = 0;
    let magnitudA = 0;
    let magnitudB = 0;

    for (let i = 0; i < vectorA.length; i++) {

        producto += vectorA[i] * vectorB[i];

        magnitudA +=
            vectorA[i] * vectorA[i];

        magnitudB +=
            vectorB[i] * vectorB[i];
    }

    magnitudA = Math.sqrt(magnitudA);
    magnitudB = Math.sqrt(magnitudB);

    if (magnitudA === 0 || magnitudB === 0) {
        return 0;
    }

    return producto /
        (magnitudA * magnitudB);
}


// ==========================================
// BUSCAR
// ==========================================

async function buscarSemantico(pregunta, limite = 5) {

    console.log(
        `\nBuscando: "${pregunta}"`
    );

    const embeddingPregunta =
        await generarEmbedding(pregunta);

    const archivos =
        fs.readdirSync(CARPETA_EMBEDDINGS)
            .filter(
                archivo =>
                    archivo.endsWith(".json")
            );

    const resultados = [];

    for (const archivo of archivos) {

        const ruta =
            path.join(
                CARPETA_EMBEDDINGS,
                archivo
            );

        const datos =
            JSON.parse(
                fs.readFileSync(
                    ruta,
                    "utf8"
                )
            );

        const puntuacion =
            similitudCoseno(
                embeddingPregunta,
                datos.embedding
            );

        resultados.push({

            archivo: datos.archivo,

            puntuacion: puntuacion
        });
    }

    resultados.sort(
        (a, b) =>
            b.puntuacion - a.puntuacion
    );

    return resultados.slice(0, limite);
}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    buscarSemantico
};