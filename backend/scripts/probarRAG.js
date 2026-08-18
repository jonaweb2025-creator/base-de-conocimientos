const {
    construirContexto
} = require("../src/contextoSemantico");

const {
    generarRespuesta
} = require("../src/generadorRespuesta");

const {
    guardarConsulta
} = require("../src/historial");

// ==========================================
// PREGUNTA DE PRUEBA
// ==========================================

const pregunta =
    "¿Qué requisitos debe cumplir un aeropuerto internacional?";
    // ==========================================
// EJECUTAR RAG
// ==========================================

async function ejecutar() {

    console.log("\n=================================");
    console.log("OPERACIONES ANSA - RAG");
    console.log("=================================");

    console.log(
        `\nPregunta: ${pregunta}`
    );

    // ======================================
    // 1. BUSCAR CONTEXTO
    // ======================================

    const contexto =
        await construirContexto(
            pregunta
        );

    console.log(
        `\nFuentes encontradas: ${contexto.length}`
    );

    // ======================================
    // 2. GENERAR RESPUESTA
    // ======================================

    console.log(
        "\nGenerando respuesta..."
    );

    const respuesta =
        await generarRespuesta(
            pregunta,
            contexto
        );

// ======================================
// 3. GUARDAR EN HISTORIAL
// ======================================

guardarConsulta({
    pregunta,
    respuesta,
    fuentes: contexto
});

console.log(
    "\nConsulta guardada en el historial."
);

    // ======================================
    // 4. MOSTRAR RESPUESTA
    // ======================================

    console.log(
        "\n================================="
    );

    console.log(
        "RESPUESTA DE LA IA"
    );

    console.log(
        "=================================\n"
    );

    console.log(
        respuesta
    );

    console.log(
        "\n================================="
    );
}


// ==========================================
// EJECUTAR
// ==========================================

ejecutar().catch(
    error => {

        console.error(
            "\n❌ ERROR:"
        );

        console.error(
            error
        );

    }
);
