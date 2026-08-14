const fs = require("fs");
const path = require("path");


// ==========================================
// CONFIGURACIÓN
// ==========================================

const MODELO_EMBEDDING = "nomic-embed-text:latest";

const CARPETA_BASE =
    path.join(__dirname, "..", "..", "BaseConocimiento");

const CARPETA_EMBEDDINGS =
    path.join(__dirname, "..", "embeddings");


// ==========================================
// GENERAR EMBEDDING
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
// PROCESAR DOCUMENTOS
// ==========================================

async function procesarDocumentos() {

    if (!fs.existsSync(CARPETA_EMBEDDINGS)) {

        fs.mkdirSync(
            CARPETA_EMBEDDINGS,
            { recursive: true }
        );
    }

    const archivos =
        fs.readdirSync(CARPETA_BASE);

    const archivosMarkdown =
        archivos.filter(
            archivo =>
                archivo.toLowerCase().endsWith(".md")
        );


    console.log(
        `Documentos encontrados: ${archivosMarkdown.length}`
    );


    for (const archivo of archivosMarkdown) {

        console.log(
            `\nProcesando: ${archivo}`
        );


        const ruta =
            path.join(CARPETA_BASE, archivo);


        const contenido =
            fs.readFileSync(
                ruta,
                "utf8"
            );


        const embedding =
            await generarEmbedding(
                contenido
            );


        const resultado = {

            archivo: archivo,

            embedding: embedding

        };


        const nombreSalida =
            archivo.replace(
                /\.md$/i,
                ".json"
            );


        const rutaSalida =
            path.join(
                CARPETA_EMBEDDINGS,
                nombreSalida
            );


        fs.writeFileSync(

            rutaSalida,

            JSON.stringify(
                resultado,
                null,
                2
            ),

            "utf8"
        );


        console.log(
            `✓ Embedding generado`
        );

        console.log(
            `Dimensiones: ${embedding.length}`
        );
    }


    console.log(
        "\n================================="
    );

    console.log(
        "PROCESO COMPLETADO"
    );

    console.log(
        "================================="
    );
}


// ==========================================
// EJECUTAR
// ==========================================

procesarDocumentos()
    .catch(error => {

        console.error(
            "\n❌ ERROR:"
        );

        console.error(
            error.message
        );

    });