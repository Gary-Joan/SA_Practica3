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
app.use('/', indexRouter);
let listapedido = new Array();
app.post("/RecibirPedidos", function (req, res) {
  var pedido =req.body;
  listapedido.push(pedido)
});
app.get("/VerPedido", function (req, res) {

  res.render("ListaMenus", { pedidos: listapedido });
});

app.post("/Entregado", (req, res) => {
  listapedido.shift();
  llamar("http://localhost:3010/quitarpedido", '');
  res.send('Pedido Entregado!!')
  
  res.end();
});

async function llamar(ui, p) {
  var resul = {
    estado: "error",
    mensaje: "no se a enviado",
  };
  try {
    var re = await axios
      .post(ui, p, { headers: { "content-type": "application/text" } })
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
app.listen(PORT, () => {
  console.log(`Repartidor escuchando en puerto: ${PORT}`);
});
