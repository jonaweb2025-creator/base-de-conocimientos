const {
    construirContexto
} = require("../src/contextoSemantico");

async function probar() {

    const pregunta =
        "¿Qué características debe tener una comunicación efectiva?";

    const fuentes =
        await construirContexto(pregunta, 6);

    console.log("\n=================================");
    console.log("CONTEXTO GENERADO");
    console.log("=================================\n");

    console.log(
        `Fuentes encontradas: ${fuentes.length}\n`
    );

    fuentes.forEach((fuente, indice) => {

        console.log(`FUENTE ${indice + 1}`);

        console.log(
            `Archivo: ${fuente.archivo}`
        );

        console.log(
            `Sección: ${fuente.seccion}`
        );

        console.log(
            `Similitud: ${fuente.similitud}`
        );

        console.log(
            `Puntuación: ${fuente.puntuacion}`
        );

        console.log("\nContenido:\n");

        console.log(
            fuente.contenido
        );

        console.log(
            "\n---------------------------------\n"
        );
    });
}

probar();