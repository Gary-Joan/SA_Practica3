const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const bodyparser = require("body-parser");
const router = express.Router();
const PORT = 3020;
const { Console } = require("console");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

//manejadores de pedido simples arrays
let listaMensajes = new Array();
app.post("/submit", function (request, response) {
  if (request.body.destino == "Restaurante") {
    listaMensajes.push(request.body);
    listaMensajes[0].estado = "Pedido Ingresado en Restaurante";
    console.log(
      "Pedido de cliente " + request.body.cliente + " ingresado a Restaurante."
    );
    llamar("http://localhost:3010/submit", listaMensajes.shift());
  } else if (
    request.body.origen == "Restaurante" &&
    request.body.destino == "Cliente"
  ) {
    listaMensajes.push(request.body);
    listaMensajes[0].estado = "Su Pedido se esta procesando en Restaurante";
    console.log(
      "Pedido de cliente " +
        request.body.cliente +
        " se esta procesando en el Restaurante."
    );
  } else if (
    request.body.destino == "Repartidor" &&
    request.body.origen == "Restaurante"
  ) {
    listaMensajes.push(request.body);
    listaMensajes[0].estado = "Su pedido fue enviado al repatidor";
    console.log(
      "Pedido de cliente " + request.body.cliente + " enviado a Repartidor"
    );
    llamar("http://localhost:3005/submit", listaMensajes.shift());
  }
  else if (
    request.body.destino == "Cliente" &&
    request.body.origen == "Repartidor"
  ) {
    listaMensajes.push(request.body);
    listaMensajes[0].estado = "Su pedido fue entregado";
    console.log(
      "Pedido de cliente " + request.body.cliente + " enviado con exito"
    );
  } else {
    console.log("Error!");
  }
});

app.get("/Estado", function (req, res, next) {
  if (listaMensajes.length > 0) {
    console.log("Estado del pedido: " + listaMensajes[0].estado);
    res.send("Estado del pedido: " + listaMensajes[0].estado);
  } else {
    console.log("No hay hecho ningun pedido a Restaurante");
    res.send("No hay hecho ningun pedido a Restaurante!!");
  }
});

/* Funcion para hacer los post segun la url mandada. */
async function llamar(ui, p) {
  var resul = {
    estado: "error",
    mensaje: "no se a enviado",
  };
  try {
    var re = await axios
      .post(ui, p, { headers: { "content-type": "application/json" } })
      .then(function (response) {
        console.log("todo correcto");
        console.log("mensaje " + p);
        resul = response.data;
        return response.data;
      })
      .catch(function (error) {
        console.log("error no encuentra el uri");
      })
      .then(function () {
        console.log("siempre ejecutando");
      });
  } catch (error) {
    console.log(error);
  }
}
/* Escuchando en el puerte predefinido. */
app.listen(PORT, () => {
  console.log(`ESB escuchando en el puerto: ${PORT}`);
});
