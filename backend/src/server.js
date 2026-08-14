const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Operaciones ANSA funcionando correctamente");
});

app.post("/api/chat", (req, res) => {

    const { pregunta } = req.body;

    res.json({
        respuesta: `Recibí tu pregunta: ${pregunta}`
    });

});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
