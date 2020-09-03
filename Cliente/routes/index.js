var express = require("express");
var router = express.Router();
const axios = require("axios");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
let menu = "";
/* POST menu info */
router.post("/submit", (req, res) => {

  const pedido = { cliente: req.body.cliente, 
                     menu: req.body.menu,
                     direccion: req.body.direccion,
                     origen:'Cliente',
                     destino:'Restaurante',
                    estado:'Enviado a Restaurante' };
  llamar("http://localhost:3020/submit", JSON.stringify(pedido));
  menu = req.body.menu;
  res.redirect("/");
  
  res.end();
});
/* GET Status of the Order. */
router.get("/Estado", async (req, res, next) => {
  let res1 = await axios
    .get("http://localhost:3020/Estado")
    .catch(function (error) {
      console.log(error);
    });

  let data = res1.data;
  res.render("RespuestaR", { respuesta: data });
  res.end();
});
/* Funcion para poder hacer el POST a una url */
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

module.exports = router;
