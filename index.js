require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const morgan = require("morgan");
const { infoLineasMetro, paradasTotales } = require("./API/paradas");

const app = express();

const puerto = 4000;

const server = app.listen(puerto, () => {
  console.log("servidor en el puerto 4000");
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());

app.get("/metro/lineas", async (req, res, next) => {
  res.send(await infoLineasMetro());
});

app.get("/metro/linea/:linea", async (req, res, next) => {
  try {
    console.log(req.params.linea);
    const lineaDeMetro = await paradasTotales(req.params.linea);
    // const lineaSeleccionada = lineaDeMetro.find((line) => {
    //   line.nombre_linia === req.params.linea;
    //   return line;
    // });
    // console.log(lineaSeleccionada);
    // res.send(
    //   lineaSeleccionada.lenght === 0
    //     ? "no exsite la linea seleccionada"
    //     : lineaSeleccionada
    // );
    res.send(lineaDeMetro);
  } catch (error) {
    next(error);
  }
});

// ESTA PARTE ESTA HECHA PARA QUE TE DEVUELVA COSAS SI HAY UN ERROR EN GENERAL
app.use((req, res, next) => {
  res.status(404).send({ error: true, mensaje: "Recurso no encontrado" });
});

app.use((err, req, res, next) => {
  const codigo = err.codigo || 500;
  const mensaje = err.codigo
    ? err.message
    : { error: true, mensaje: "Error general" };
  res.status(codigo).send(mensaje);
});
