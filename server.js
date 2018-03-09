var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended: true}) );


app.use( '/public', express.static( __dirname + '/public') );
app.use( '/uploads', express.static( __dirname + '/uploads') );
app.use('/api', require('./routers/api'));


app.listen(8888);