// Demo server app - developed for Gamification demo .... 
// This will expose some sample APIs via REST to call product database 

// import express module - web app server
// import body-parser extracts the entire body portion of an incoming request stream and exposes it on req.body as something easier to interact with
// import mysql modeule to connect to mysql

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");

// set port
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// we will use JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
	

// default route
app.get('/', function (req, res) {
  res.render('index.html',{error : null, message :'This is the home index page'});
});


//mysql configuration - Gamification project mysql connect details
var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'custom-mysql.gamification.svc.cluster.local';
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
var mysqlUser = 'xxuser'; 
var mysqlPass = 'welcome1';

// we will use sampledb as database
var mysqlDb = 'sampledb';

//form the connection string to connect to mysql - you can connect directly too 
var mysqlString = 'mysql://' + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;
console.log(mysqlString);


//connect to mysql/sampledb database
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function (err) {
    if (err) console.log(err);
});



// set port
app.listen(port, ip);

module.exports = app;
