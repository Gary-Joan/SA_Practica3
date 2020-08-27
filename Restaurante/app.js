const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const bodyparser = require("body-parser");
const router = express.Router();
const PORT = 3010;
var indexRouter = require("./routes/index");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

let listaPedidos = new Array();
let listaPedidosRepartidor=new Array();
app.post("/submit", function (request, response) {
  listaPedidos.push(request.body);
});

app.get("/VerPedidos", function (req, res) {
  res.render("Pedidos", { pedidos: listaPedidos });
});
app.get("/StatusPedidoRestaurante", function (req, res, next) {
  if (listaPedidos.length>0) {
    console.log('Su pedido esta aun en Restaurante!!')
    res.send('Su pedido esta aun en Restaurante!!')

  }else if( listaPedidosRepartidor.length>0){
    console.log('Su pedido esta Siendo llevado por el repartidor!!')
    res.send('Su pedido esta Siendo llevado por el repartidor!!')
  }else{
    res.send('Su pedido ha sido entregado..')
  }
 


});
app.post("/quitarpedido", function (req, res) {
  listaPedidosRepartidor.shift();
});
app.post("/EnviarPedidos", function (request, response) {
  if (listaPedidos.length>0){
  var menu=listaPedidos.shift();
  listaPedidosRepartidor.push(menu);
  llamar("http://localhost:3005/RecibirPedidos", JSON.stringify(menu));
  response.redirect("/");
  response.end();
  }else{
    response.send('No hay pedidos!!');
  }
  response.end();
});

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













app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Restaurante escuchando en puerto: ${PORT}`);
});
