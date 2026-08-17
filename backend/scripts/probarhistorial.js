const {
    guardarConsulta,
    obtenerHistorial
} = require("../src/historial");


const registro = guardarConsulta({

    pregunta:
        "Pregunta de prueba",

    respuesta:
        "Respuesta de prueba",

    fuentes: [
        {
            archivo: "archivo-prueba.md",
            seccion: "Sección de prueba"
        }
    ]

});


console.log("\nRegistro guardado:");

console.log(registro);


console.log("\nHistorial completo:");

console.log(
    obtenerHistorial()
);