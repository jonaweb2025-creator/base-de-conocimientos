const { Ollama } = require("ollama");

const ollama = new Ollama({
    host: "http://127.0.0.1:11434"
});

// ==========================================
// CONFIGURACIÓN
// ==========================================

const MODELO = "llama3.1:8b";

// ==========================================
// GENERAR RESPUESTA
// ==========================================

async function generarRespuesta(
    pregunta,
    contexto
) {

    // ======================================
    // CONSTRUIR CONTEXTO
    // ======================================

    let contextoTexto = "";

    for (const fuente of contexto) {

        contextoTexto += `
FUENTE
Archivo: ${fuente.archivo}
Sección: ${fuente.seccion}

${fuente.contenido}

---
`;
    }

    // ======================================
    // PROMPT
    // ======================================

    const prompt = `
Eres el asistente de conocimiento de Operaciones ANSA.

Tu función es responder preguntas utilizando ÚNICAMENTE
la información contenida en el CONTEXTO proporcionado.

REGLAS:

1. No inventes información.

2. No utilices conocimientos externos al CONTEXTO.

3. Si el CONTEXTO no contiene información suficiente
para responder la pregunta, debes decir:

"La información disponible en la Base de Conocimiento
no es suficiente para responder esta pregunta."

4. Mantén los términos utilizados en la documentación.

5. No cambies el significado de la documentación.

6. Puedes utilizar información de varias fuentes
cuando sea necesario.

7. Responde de forma clara y directa.

8. Cuando sea posible, indica de qué lección proviene
la información utilizada.

9. No completes información faltante utilizando
conocimientos generales.

10. Si la pregunta solicita enumerar, listar o identificar
elementos, incluye TODOS los elementos que aparezcan
en el CONTEXTO relacionados con la pregunta.

11. No omitas elementos relevantes del CONTEXTO para
hacer la respuesta más breve.

12. Si el CONTEXTO contiene una lista explícita,
reprodúcela completa manteniendo sus términos.

13. No reemplaces una lista del CONTEXTO por un resumen.

14. La respuesta debe estar respaldada directamente
por el CONTEXTO.

15. Si el CONTEXTO no contiene información suficiente
para responder exactamente la pregunta, responde ÚNICAMENTE:

"La información disponible en la Base de Conocimiento
no es suficiente para responder esta pregunta."

16. No agregues información relacionada, complementaria
o parcialmente relacionada cuando la información
solicitada no esté disponible.

17. No respondas con información que simplemente aparezca
en el CONTEXTO si esa información no responde directamente
a la pregunta.

18. Cuando determines que la información no es suficiente,
NO agregues ninguna explicación, ejemplo, dato adicional
ni información relacionada.

========================================
CONTEXTO
========================================

${contextoTexto}

========================================
PREGUNTA
========================================

${pregunta}

========================================
RESPUESTA
========================================
`;

    // ======================================
    // CONSULTAR LLAMA
    // ======================================

    const respuesta =
        await ollama.chat({

            model: MODELO,

            messages: [

                {
                    role: "user",
                    content: prompt
                }

            ]

        });

    const textoRespuesta =
    respuesta.message.content.trim();

const mensajeSinInformacion =
    "La información disponible en la Base de Conocimiento no es suficiente para responder esta pregunta.";

// Si la IA determina que no existe información suficiente,
// impedir que agregue explicaciones o información relacionada.
if (
    textoRespuesta.includes(
        mensajeSinInformacion
    )
) {
    return mensajeSinInformacion;
}

return textoRespuesta;
}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    generarRespuesta
};
