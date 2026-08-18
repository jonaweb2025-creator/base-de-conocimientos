const {
    buscarSecciones
} = require("../src/buscadorSecciones");

const {
    validarContexto
} = require("../src/validadorContexto");


async function ejecutar() {

    const pregunta =
        "¿Qué es la comunicación?";


    console.log(
        `\nPregunta: ${pregunta}`
    );


    // ======================================
    // BUSCAR SECCIONES
    // ======================================

    const fuentes =
        await buscarSecciones(
            pregunta,
            4
        );


    console.log(
        `Fuentes recuperadas: ${fuentes.length}`
    );


    fuentes.forEach(
        (fuente, indice) => {

            console.log(
                `\n${indice + 1}. ${fuente.archivo}`
            );

            console.log(
                `   Sección: ${fuente.seccion}`
            );

            console.log(
                `   Similitud: ${fuente.similitud.toFixed(4)}`
            );

        }
    );


    // ======================================
    // VALIDAR CONTEXTO
    // ======================================

    console.log(
        "\nValidando contexto..."
    );


    const validacion =
        await validarContexto(
            pregunta,
            fuentes
        );


    console.log(
        "\n================================="
    );

    console.log(
        "RESULTADO DEL VALIDADOR"
    );

    console.log(
        "================================="
    );


    console.log(
        `Contexto válido: ${validacion.valido}`
    );

    console.log(
        `Motivo: ${validacion.motivo}`
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
