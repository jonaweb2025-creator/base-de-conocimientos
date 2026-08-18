const { Ollama } = require("ollama");

const ollama = new Ollama({
    host: "http://127.0.0.1:11434"
});

// ==========================================
// CONFIGURACIÓN
// ==========================================

const MODELO = "llama3.1:8b";

const MENSAJE_SIN_INFORMACION =
    "La información disponible en la Base de Conocimiento no es suficiente para responder esta pregunta.";


// ==========================================
// GENERAR RESPUESTA
// ==========================================

async function generarRespuesta(
    pregunta,
    contexto
) {

    // ======================================
    // VALIDAR CONTEXTO
    // ======================================

    if (
        !Array.isArray(contexto) ||
        contexto.length === 0
    ) {
        return MENSAJE_SIN_INFORMACION;
    }


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
    // INSTRUCCIONES DEL SISTEMA
    // ======================================

    const instrucciones = `
Eres el asistente de conocimiento de Operaciones ANSA.

Tu función es responder preguntas utilizando ÚNICAMENTE
la información incluida en el CONTEXTO proporcionado.

REGLAS OBLIGATORIAS:

1. No inventes información.

2. No utilices conocimientos externos al CONTEXTO.

3. Si el CONTEXTO contiene una definición explícita
que responde a la pregunta, debes utilizarla.

4. No ignores información explícita presente en el CONTEXTO.

5. Mantén los términos utilizados en la documentación.

6. No cambies el significado de la documentación.

7. Puedes utilizar varias fuentes cuando sea necesario.

8. Responde de forma clara y directa.

9. Cuando sea posible, indica el archivo y la sección
de donde proviene la información.

10. Si la pregunta solicita enumerar, listar o identificar
elementos, incluye TODOS los elementos relevantes
presentes en el CONTEXTO.

11. Si el CONTEXTO contiene una lista explícita,
reprodúcela completa.

12. No reemplaces una lista explícita por un resumen
que elimine elementos.

13. No agregues información relacionada si no responde
directamente a la pregunta.

14. No completes información faltante utilizando
conocimientos generales.

15. SOLO si el CONTEXTO realmente no contiene información
suficiente para responder la pregunta, responde exactamente:

"${MENSAJE_SIN_INFORMACION}"

16. Si utilizas el mensaje anterior, no agregues ninguna
explicación, nota, ejemplo ni información adicional.
`;


    // ======================================
    // MENSAJE DEL USUARIO
    // ======================================

    const consultaUsuario = `
CONTEXTO:

${contextoTexto}

PREGUNTA:

${pregunta}

Responde utilizando únicamente el contexto anterior.
`;


    // ======================================
    // CONSULTAR LLAMA
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
                    content: consultaUsuario
                }
            ],

            options: {
                temperature: 0
            }

        });


    // ======================================
    // PROCESAR RESPUESTA
    // ======================================

    const textoRespuesta =
        respuesta.message.content.trim();


    // Si el modelo determina que no existe información
    // suficiente, devolver únicamente el mensaje oficial.
    if (
        textoRespuesta.includes(
            MENSAJE_SIN_INFORMACION
        )
    ) {
        return MENSAJE_SIN_INFORMACION;
    }


    return textoRespuesta;
}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    generarRespuesta
};