const { buscar } = require("./buscador");

const consulta = "¿Qué características debe tener una comunicación efectiva?";

const resultados = buscar(consulta);

console.log("\n==============================");
console.log("PRUEBA DEL BUSCADOR");
console.log("==============================");

console.log(`Consulta: ${consulta}`);
console.log(`Resultados: ${resultados.length}`);

resultados.forEach((resultado, indice) => {

    console.log(
        `\n--- Resultado ${indice + 1} ---`
    );

    console.log(
        `Archivo: ${resultado.archivo}`
    );

    console.log(
        `Sección: ${resultado.titulo}`
    );

    console.log("\nContenido:");

    console.log(resultado.contenido);

    console.log(`Puntuación: ${resultado.puntuacion}`);
});