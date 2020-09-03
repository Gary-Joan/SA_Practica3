const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const bodyparser = require("body-parser");
const router = express.Router();
const PORT = 3005;
var indexRouter = require("./routes/index");
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
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", indexRouter);
let listapedido = new Array();
/* REsive la lista de pedidos desde el restaurante */
app.post("/submit", function (req, res) {
  var pedido = req.body;
  listapedido.push(pedido);
});
/* Aqui se ven los pedidos pendientes del repartidor */
app.get("/VerPedido", function (req, res) {
  res.render("ListaMenus", { pedidos: listapedido });
});
/* Mandaun status al restaurante que se entregado el pedido. */
app.post("/Entregado", (req, res) => {
  listapedido[0].destino='Cliente';
  listapedido[0].origen='Repartidor';
  llamar("http://localhost:3020/submit", listapedido.shift());
  res.end();
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
  console.log(`Repartidor escuchando en puerto: ${PORT}`);
});
