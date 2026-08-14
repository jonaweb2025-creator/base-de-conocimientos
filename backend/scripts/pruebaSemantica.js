const {
    buscarSemantico
} = require("../src/buscadorSemantico");


async function ejecutar() {

    const pregunta =
        "¿Qué elementos intervienen cuando dos personas intercambian información?";

    const resultados =
        await buscarSemantico(
            pregunta,
            5
        );


    console.log("\n==============================");
    console.log("RESULTADOS BÚSQUEDA SEMÁNTICA");
    console.log("==============================");


    resultados.forEach(
        (resultado, indice) => {

            console.log(
                `\nResultado ${indice + 1}`
            );

            console.log(
                `Archivo: ${resultado.archivo}`
            );

            console.log(
                `Similitud: ${resultado.puntuacion.toFixed(4)}`
            );
        }
    );
}


ejecutar()
    .catch(error => {

        console.error(
            "\n❌ ERROR:"
        );

        console.error(
            error.message
        );

    });