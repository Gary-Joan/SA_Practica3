const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const bodyparser = require("body-parser");
const PORT = 3000;
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

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Cliente escuchando en puerto: ${PORT}`);
});
