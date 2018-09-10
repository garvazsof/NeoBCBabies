var index = require('./index.js');

var express = require('express'),
app = express(),
port = process.env.express || 8075

app.listen(port);

console.log('BCBABIES REST api server started on: ' + port );

index.bcbabies();