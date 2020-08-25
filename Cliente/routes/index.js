var express = require('express');
var router = express.Router();
const axios = require("axios");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/submit", (req, res) => {
    const username = req.body.cliente;
    console.log(JSON.stringify(username));
    llamar('http://localhost:3010/submit',username)
    res.redirect('/');
    res.end();
    
  });

  router.post('/StatusPedidoRestaurante', function(req, res, next) {
    console.log('El estado de su pedidos en el restaurante es: ')
  });
  router.post('/StatusPedidoRepartidor', function(req, res, next) {
    console.log('El estado de su pedido en el repartidor es: ')
  });



  async function llamar(ui,p)
  {
      var resul={
          estado:"error",
          mensaje:"no se a enviado"
      }        
      try
      {
         var re= await  axios.post(ui,p)
         .then(function(response){
             console.log("todo correcto")
             resul=response.data
             return response.data;        
         })
         .catch(function(error){
             console.log("error no encuentra el uri")
             resul.estado="error"
             resul.mensaje="no encontro el uri o no responde"

         })
         .then(function(){
             console.log("siempre ejecutando")
             
         });
      }
      catch(error)
      {
          console.log(error)
      }
      
  };

module.exports = router;
