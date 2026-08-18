const express = require("express");

const {
    buscarSecciones
} = require("./buscadorSecciones");

const {
    validarContexto
} = require("./validadorContexto");

const {
    generarRespuesta
} = require("./generadorRespuesta");

const {
    guardarConsulta
} = require("./historial");


// ==========================================
// CONFIGURACIÓN
// ==========================================

const app = express();

app.use(express.json());

const PORT = 3000;

const MENSAJE_SIN_INFORMACION =
    "La información disponible en la Base de Conocimiento no es suficiente para responder esta pregunta.";


// ==========================================
// RUTA DE PRUEBA
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "Operaciones ANSA funcionando correctamente"
    );

});


// ==========================================
// CHAT RAG
// ==========================================

app.post("/api/chat", async (req, res) => {

    try {

        const { pregunta } = req.body;


        // ======================================
        // 1. VALIDAR PREGUNTA
        // ======================================

        if (
            !pregunta ||
            typeof pregunta !== "string" ||
            pregunta.trim() === ""
        ) {

            return res.status(400).json({

                error:
                    "Debe enviar una pregunta válida."

            });

        }


        // ======================================
        // 2. BUSCAR SECCIONES
        // ======================================

        const fuentes =
            await buscarSecciones(
                pregunta,
                4
            );


        console.log(
            `\nPregunta: "${pregunta}"`
        );

        console.log(
            `Fuentes recuperadas: ${fuentes.length}`
        );


        // ======================================
        // 3. VALIDAR CONTEXTO
        // ======================================

        const validacion =
            await validarContexto(
                pregunta,
                fuentes
            );


        console.log(
            `Contexto válido: ${validacion.valido}`
        );


        let respuesta;


        // ======================================
        // 4. DECIDIR SI GENERAR RESPUESTA
        // ======================================

        if (!validacion.valido) {

            respuesta =
                MENSAJE_SIN_INFORMACION;

        } else {

            respuesta =
                await generarRespuesta(
                    pregunta,
                    fuentes
                );

        }


        // ======================================
        // 5. GUARDAR HISTORIAL
        // ======================================

        guardarConsulta({

            pregunta,

            respuesta,

            fuentes

        });


        // ======================================
        // 6. RESPONDER AL CLIENTE
        // ======================================

        return res.json({

            pregunta,

            respuesta,

            fuentes:
                validacion.valido

                    ? fuentes.map(
                        fuente => ({

                            archivo:
                                fuente.archivo,

                            seccion:
                                fuente.seccion,

                            similitud:
                                Number(
                                    fuente.similitud.toFixed(4)
                                )

                        })
                    )

                    : []

        });


    } catch (error) {

        console.error(
            "Error en /api/chat:",
            error
        );


        return res.status(500).json({

            error:
                "Ocurrió un error al procesar la consulta."

        });

    }

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Servidor iniciado en http://localhost:${PORT}`
    );

});