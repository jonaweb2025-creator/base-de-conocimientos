const { buscar } = require("./buscador");


// ==========================================
// CONSTRUIR CONTEXTO
// ==========================================

function construirContexto(consulta) {

    const resultados = buscar(consulta);

    if (resultados.length === 0) {

        return {
            encontrado: false,
            contexto: ""
        };
    }

    const contexto = resultados
        .map((resultado, indice) => {

            return `
FUENTE ${indice + 1}
Archivo: ${resultado.archivo}
Sección: ${resultado.titulo}

${resultado.contenido}
`;

        })
        .join("\n------------------------------\n");

    return {
        encontrado: true,
        resultados: resultados.length,
        contexto: contexto.trim()
    };
}


module.exports = {
    construirContexto
};