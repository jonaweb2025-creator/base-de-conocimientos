function generarContexto(fuentes) {

    if (!fuentes || fuentes.length === 0) {

        return "No se encontró información relevante en la Base de Conocimiento.";
    }

    let contexto =
        "CONTEXTO DE LA BASE DE CONOCIMIENTO\n\n";


    fuentes.forEach((fuente, indice) => {

        contexto +=
            `FUENTE ${indice + 1}\n`;

        contexto +=
            `Archivo: ${fuente.archivo}\n`;

        contexto +=
            `Sección: ${fuente.seccion}\n\n`;

        contexto +=
            `${fuente.contenido}\n\n`;

        contexto +=
            "---------------------------------\n\n";
    });


    return contexto.trim();
}


module.exports = {
    generarContexto
};