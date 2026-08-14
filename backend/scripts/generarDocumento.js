const fs = require("fs");
const path = require("path");

//====================================================
// RUTAS
//====================================================

const carpetaImportar = path.join(
    __dirname,
    "..",
    "..",
    "Importar"
);

const carpetaBaseConocimiento = path.join(
    __dirname,
    "..",
    "..",
    "BaseConocimiento"
);

const archivoCategorias = path.join(
    __dirname,
    "..",
    "config",
    "categorias.json"
);


//====================================================
// LEER METADATOS
//====================================================

function obtenerMetadatos(contenido) {

    const metadatos = {};

    const lineas = contenido.split(/\r?\n/);

    let dentroCabecera = false;

    for (const linea of lineas) {

        // Inicio de la cabecera
        if (linea.trim() === "---" && !dentroCabecera) {
            dentroCabecera = true;
            continue;
        }

        // Fin de la cabecera
        if (linea.trim() === "---" && dentroCabecera) {
            break;
        }

        // Ignorar lo que esté fuera de la cabecera
        if (!dentroCabecera) {
            continue;
        }

        // Ignorar líneas vacías
        if (linea.trim() === "") {
            continue;
        }

        // Buscar :
        const posicion = linea.indexOf(":");

        if (posicion === -1) {
            continue;
        }

        const clave = linea
            .substring(0, posicion)
            .trim();

        const valor = linea
            .substring(posicion + 1)
            .trim();

        metadatos[clave] = valor;
    }

    return metadatos;
}


//====================================================
// VALIDAR METADATOS
//====================================================

function validarMetadatos(metadatos, categorias) {

    const errores = [];

    const camposObligatorios = [
        "id",
        "titulo",
        "programa",
        "curso",
        "leccion",
        "categoria"
    ];

    camposObligatorios.forEach(campo => {

        if (!metadatos[campo]) {
            errores.push(
                `Falta el campo: ${campo}`
            );
        }

    });


    // Validar categoría

    if (metadatos.categoria) {

        const categoriaValida = categorias.some(
            categoria =>
                categoria.nombre === metadatos.categoria
        );

        if (!categoriaValida) {

            errores.push(
                `Categoría no válida: ${metadatos.categoria}`
            );

        }

    }

    return errores;
}


//====================================================
// CONTAR PALABRAS
//====================================================

function contarPalabras(contenido) {

    return contenido
        .trim()
        .split(/\s+/)
        .length;
}


//====================================================
// CREAR CARPETA DESTINO
//====================================================

if (!fs.existsSync(carpetaBaseConocimiento)) {

    fs.mkdirSync(
        carpetaBaseConocimiento,
        {
            recursive: true
        }
    );

}


//====================================================
// CARGAR CATEGORÍAS
//====================================================

const datosCategorias = JSON.parse(
    fs.readFileSync(
        archivoCategorias,
        "utf8"
    )
);

const categorias = datosCategorias.categorias;


//====================================================
// BUSCAR ARCHIVOS MARKDOWN
//====================================================

const archivos = fs.readdirSync(
    carpetaImportar
);

const archivosMarkdown = archivos.filter(
    archivo =>
        archivo.toLowerCase().endsWith(".md")
);


//====================================================
// PROCESAR DOCUMENTOS
//====================================================

console.log("\n========================================");
console.log("OPERACIONES ANSA");
console.log("PROCESADOR DE DOCUMENTOS");
console.log("========================================");

console.log(
    `\nArchivos encontrados: ${archivosMarkdown.length}`
);


archivosMarkdown.forEach(
    (archivo, indice) => {

        console.log(
            `\n\nDocumento ${indice + 1}: ${archivo}`
        );


        // -----------------------------------------
        // LEER ARCHIVO
        // -----------------------------------------

        const rutaArchivo = path.join(
            carpetaImportar,
            archivo
        );

        const contenido = fs.readFileSync(
            rutaArchivo,
            "utf8"
        );


        // -----------------------------------------
        // OBTENER METADATOS
        // -----------------------------------------

        const metadatos = obtenerMetadatos(
            contenido
        );


        // -----------------------------------------
        // VALIDAR
        // -----------------------------------------

        const errores = validarMetadatos(
            metadatos,
            categorias
        );


        if (errores.length > 0) {

            console.log("\n❌ DOCUMENTO NO VÁLIDO");

            errores.forEach(error => {
                console.log(`- ${error}`);
            });

            return;
        }


        // -----------------------------------------
        // MOSTRAR INFORMACIÓN
        // -----------------------------------------

        console.log("\n✅ DOCUMENTO VÁLIDO");

        console.log(
            `ID        : ${metadatos.id}`
        );

        console.log(
            `Título    : ${metadatos.titulo}`
        );

        console.log(
            `Programa  : ${metadatos.programa}`
        );

        console.log(
            `Curso     : ${metadatos.curso}`
        );

        console.log(
            `Lección   : ${metadatos.leccion}`
        );

        console.log(
            `Categoría : ${metadatos.categoria}`
        );


        // -----------------------------------------
        // ESTADÍSTICAS
        // -----------------------------------------

        console.log(
            `Palabras  : ${contarPalabras(contenido)}`
        );


        // -----------------------------------------
        // GUARDAR
        // -----------------------------------------

        const rutaDestino = path.join(
            carpetaBaseConocimiento,
            archivo
        );

        fs.copyFileSync(
            rutaArchivo,
            rutaDestino
        );

        console.log(
            `\n📁 Guardado en: ${rutaDestino}`
        );

    }
);