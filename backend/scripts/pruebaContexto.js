const {
    construirContexto
} = require("./contexto");


const consulta =
    "¿Qué características debe tener una comunicación efectiva?";


const resultado =
    construirContexto(consulta);


console.log("\n==============================");
console.log("PRUEBA DE CONTEXTO");
console.log("==============================");

console.log(
    `Consulta: ${consulta}`
);

console.log(
    `Encontrado: ${resultado.encontrado}`
);

console.log(
    `Resultados: ${resultado.resultados}`
);

console.log("\n==============================");
console.log("CONTEXTO");
console.log("==============================");

console.log(resultado.contexto);