const {
    buscarSecciones
} = require("../src/buscadorSecciones");


async function ejecutar() {

    const pregunta =
        "¿Qué requisitos debe cumplir un aeropuerto internacional?";


    console.log(
        `\nPregunta: ${pregunta}`
    );


    const resultados =
        await buscarSecciones(
            pregunta,
            5
        );


    console.log(
        "\n================================="
    );

    console.log(
        "RESULTADOS POR SECCIÓN"
    );

    console.log(
        "================================="
    );


    resultados.forEach(
        (resultado, indice) => {

            console.log(
                `\nResultado ${indice + 1}`
            );

            console.log(
                `Archivo: ${resultado.archivo}`
            );

            console.log(
                `Sección: ${resultado.seccion}`
            );

            console.log(
                `Similitud: ${resultado.similitud.toFixed(4)}`
            );

            console.log(
                "\nContenido:"
            );

            console.log(
                resultado.contenido
            );

            console.log(
                "\n---------------------------------"
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