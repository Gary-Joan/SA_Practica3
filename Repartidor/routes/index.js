var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/submit", (req, res) => {
    const username = req.body.cliente;
    console.log(username);
    res.redirect('/');
    res.end();
  });
module.exports = router;
