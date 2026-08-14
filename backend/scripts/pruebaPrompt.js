const {
    construirContexto
} = require("./contextoSemantico");

const {
    generarContexto
} = require("./generarContexto");

const {
    construirPrompt
} = require("./prompt");


async function ejecutar() {

    const pregunta =
        "¿Qué características debe tener una comunicación efectiva?";


    // ==========================================
    // BUSCAR INFORMACIÓN
    // ==========================================

    const fuentes =
        await construirContexto(
            pregunta,
            3
        );


    // ==========================================
    // GENERAR CONTEXTO
    // ==========================================

    const contexto =
        generarContexto(
            fuentes
        );


    // ==========================================
    // GENERAR PROMPT
    // ==========================================

    const prompt =
        construirPrompt(
            pregunta,
            contexto
        );


    // ==========================================
    // MOSTRAR RESULTADO
    // ==========================================

    console.log(
        "\n================================="
    );

    console.log(
        "PROMPT PARA LA IA"
    );

    console.log(
        "=================================\n"
    );


    console.log(prompt);

}


ejecutar()
    .catch(error => {

        console.error(
            "\n❌ ERROR:"
        );

        console.error(error);

    });