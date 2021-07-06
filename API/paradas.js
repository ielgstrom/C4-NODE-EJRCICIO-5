require("dotenv").config();
const fetch = require("node-fetch");

const appKey = process.env.APP_KEY;
const appId = process.env.APP_ID;
const urlAPILineas = `${process.env.API_URL}?app_key=${appKey}&app_id=${appId}`;
const urlAPIParadas = (linea) =>
  `${process.env.API_URL}${linea}/estacions?app_key=${appKey}&app_id=${appId}`;

const getLineasMetro = async () => {
  const resp = await fetch(urlAPILineas);
  const { features } = await resp.json();
  return features;
};

const infoLineasMetro = async () => {
  const properties = await getLineasMetro();
  const nuevo = await properties.map((elemento) => ({
    id: elemento.properties.ID_LINIA,
    descripcion: elemento.properties.DESC_LINIA,
    nombre_linia: elemento.properties.NOM_LINIA,
  }));

  return nuevo;
};

const paradasTotales = async (linea) => {
  const properties = await getLineasMetro();
  const lineaFiltrada = properties.find(
    (line) => line.properties.NOM_LINIA === linea
  );
  const apiParadas = urlAPIParadas(lineaFiltrada.properties.CODI_LINIA);
  const paradasAgain = await fetch(apiParadas);
  const paradasOtraVez = await paradasAgain.json();
  const lineaToReturn = {
    id: lineaFiltrada.properties.ID_LINIA,
    descripcion: lineaFiltrada.properties.DESC_LINIA,
    nombre_linia: lineaFiltrada.properties.NOM_LINIA,
    paradas: paradasOtraVez.map(),
  };
  return lineaToReturn;
};

const getParadasLinea = async (linea) => {
  const resp = await fetch(urlAPIParadas(linea));
  const paradas = await resp.json();
  return paradas;
};

module.exports = {
  infoLineasMetro,
  getParadasLinea,
  paradasTotales,
};
