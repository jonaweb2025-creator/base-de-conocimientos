const { Ollama } = require("ollama");

const ollama = new Ollama({
    host: "http://127.0.0.1:11434"
});

const MODELO = "llama3.1:8b";


// ==========================================
// VALIDAR SI EL CONTEXTO RESPONDE
// ==========================================

async function validarContexto(
    pregunta,
    fuentes
) {

    // Si no hay fuentes, no hay respuesta.
    if (
        !Array.isArray(fuentes) ||
        fuentes.length === 0
    ) {

        return {
            valido: false,
            motivo: "No se encontraron fuentes."
        };
    }


    // ======================================
    // CONSTRUIR TEXTO DE FUENTES
    // ======================================

    let contextoTexto = "";

    for (const fuente of fuentes) {

        contextoTexto += `
FUENTE
Archivo: ${fuente.archivo}
Sección: ${fuente.seccion}

${fuente.contenido}

---
`;

    }


    // ======================================
    // PROMPT DEL VALIDADOR
    // ======================================

    const instrucciones = `
Actúas como validador de contexto de un sistema RAG.

Tu única tarea es determinar si el CONTEXTO contiene
información suficiente para responder DIRECTAMENTE
la PREGUNTA.

No debes responder la pregunta.

No debes utilizar conocimientos externos.

No debes considerar suficiente una fuente solamente
porque trate un tema relacionado.

Ejemplo:

Pregunta:
¿Qué requisitos debe cumplir un aeropuerto internacional?

Contexto:
En aeropuertos internacionales las frecuencias se
encuentran publicadas en el AIP.

Resultado:
NO

Motivo:
El contexto habla de frecuencias y documentación,
pero no establece requisitos que deba cumplir
un aeropuerto internacional.

Otro ejemplo:

Pregunta:
¿Qué es la comunicación?

Contexto:
La comunicación es la acción consciente de intercambiar
información entre dos o más participantes...

Resultado:
SI

Devuelve ÚNICAMENTE una de estas dos palabras:

SI

o

NO
`;


    const consulta = `
PREGUNTA:

${pregunta}

CONTEXTO:

${contextoTexto}
`;


    // ======================================
    // CONSULTAR MODELO
    // ======================================

    const respuesta =
        await ollama.chat({

            model: MODELO,

            messages: [
                {
                    role: "system",
                    content: instrucciones
                },
                {
                    role: "user",
                    content: consulta
                }
            ],

            options: {
                temperature: 0
            }

        });


    const resultado =
        respuesta.message.content
            .trim()
            .toUpperCase();


    // ======================================
    // INTERPRETAR RESULTADO
    // ======================================

    if (resultado.startsWith("SI")) {

        return {
            valido: true,
            motivo: "El contexto permite responder."
        };

    }


    return {
        valido: false,
        motivo: "El contexto no responde directamente la pregunta."
    };

}


module.exports = {
    validarContexto
};
