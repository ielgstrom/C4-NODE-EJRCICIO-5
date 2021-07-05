require("dotenv").config();
const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");

const app = express();

const puerto = 4000;

const server = app.listen(puerto, () => {
  console.log("servidor en el puerto 4000");
});
