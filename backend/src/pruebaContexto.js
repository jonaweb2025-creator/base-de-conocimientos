const {
    construirContexto
} = require("./contextoSemantico");


async function ejecutar() {

    const pregunta =
        "¿Qué características debe tener una comunicación efectiva?";


    const fuentes =
        await construirContexto(
            pregunta,
            3
        );


    console.log(
        "\n================================="
    );

    console.log(
        "PRUEBA DE CONTEXTO SEMÁNTICO"
    );

    console.log(
        "================================="
    );


    console.log(
        `\nPregunta: ${pregunta}`
    );


    console.log(
        `Fuentes encontradas: ${fuentes.length}`
    );


    fuentes.forEach(
        (fuente, indice) => {

            console.log(
                "\n---------------------------------"
            );

            console.log(
                `FUENTE ${indice + 1}`
            );

            console.log(
                `Archivo: ${fuente.archivo}`
            );

            console.log(
                `Sección: ${fuente.seccion}`
            );

            console.log(
                `Similitud: ${fuente.similitud.toFixed(4)}`
            );

            console.log(
                "\nContenido:"
            );

            console.log(
                fuente.contenido
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
            error
        );

    });