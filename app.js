var express = require("express");
var bodyParser = require("body-parser");
// var routes = require("./routes/routes-babies-testInfura.js");
var routes = require("./routes/routes-babies.js");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

const PORT = process.env.PORT || 3000

var server = app.listen(PORT, function () {
    console.log("app running on port.", PORT); 
}); 
