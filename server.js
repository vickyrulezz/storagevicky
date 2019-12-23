
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');

var path = require('path');
const VIEWS = path.join(__dirname, 'views');
var mysql     =    require('mysql');

const bodyParser = require('body-parser');
	
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;
    
const fetch_data_sql = await require('./views/fetch_data');

Object.assign=require('object-assign')

app.set('views', VIEWS);
app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); 


app.get('/', function (req, res) {
     res.render('index.html', { root : VIEWS });
});

// Route to pages
app.get('/home', function (req, res) {
     res.render('index.html', { root : VIEWS });
});

app.get("/contact", function (req, res) {
  res.sendFile('contact.html', { root : VIEWS });
 });

app.get("/about", function (req, res) {
  res.sendFile('about.html', { root : VIEWS });
});

// Route to css stylesheet and images
app.get("/animate", function (req, res) {
  res.sendFile('animate.css', { root : VIEWS });
});
app.get("/bootstrap", function (req, res) {
  res.sendFile('bootstrap.css', { root : VIEWS });
});
app.get("/owl.carousel.min", function (req, res) {
  res.sendFile('owl.carousel.min.css', { root : VIEWS });
});
app.get("/style", function (req, res) {
  res.sendFile('style.css', { root : VIEWS });
});
app.get("/background", function (req, res) {
  res.sendFile('background.jpg', { root : VIEWS });
});

// Get the data from mysql database
app.get("/fetch_data", function (req, res) {
  //res.sendFile('fetch_data.js', { root : VIEWS });
  //res.send('Hello World !!', { root : VIEWS });
 let product_data = fetch_data_sql;
//create the server for browser access
const server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(product_data, 'utf-8');
    res.end();
	});
});


// Port Listen
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

//server.listen(port, ()=>{
//  console.log('Server running at //localhost:8080/');
//});

module.exports = app ;
