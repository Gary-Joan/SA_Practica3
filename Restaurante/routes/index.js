var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post("/submit", (req, res) => {
    const username = req.body;
    console.log(username);

    res.end();
  });
module.exports = router;