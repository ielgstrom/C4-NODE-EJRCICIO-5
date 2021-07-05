require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const morgan = require("morgan");
const { infoLineasMetro, getParadasLinea } = require("./API/paradas");

const app = express();

const puerto = 4000;

const server = app.listen(puerto, () => {
  console.log("servidor en el puerto 4000");
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

// app.put("/mapa", (req, res, next) => {
//   debug(req.body);
//   const { nombre } = req.body;
//   fs.readFile("mapa-metro.jpg", "utf8", (err, datos) => {
//     if (err) {
//       debug("No se ha podido leer el archivo");
//       const error = new Error("Error al leer saludos.txt");
//       error.codigo = 500;
//       next(error);
//       return;
//     }
//     res.json({ texto: `${datos}, ${nombre}`, estado: 1 });
//   });
// });

app.get("/metro/lineas", (req, res, next) => {
  (async () => {
    res.send(await infoLineasMetro());
  })();
});

// ESTA PARTE ESTA HECHA PARA QUE TE DEVUELVA COSAS SI HAY UN ERROR EN GENERAL
app.use((req, res, next) => {
  debug("Esto es un 404");
  res.status(404).send("No se ha encontrado esta ruta");
});

app.use((err, req, res, next) => {
  const codigo = err.codigo || 500;
  const mensaje = err.codigo ? err.message : "Ha habido un error general";
  res.status(codigo).send(mensaje);
});
