
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');

var path = require('path');
const VIEWS = path.join(__dirname, 'views');

const bodyParser = require('body-parser');
	
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;
    
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
app.get("/fetch_data1", function (req, res) {
  //res.sendFile('fetch_data.js', { root : VIEWS });
  res.send('Hello World !!', { root : VIEWS });
});

app.get('/fetch_data', function(req, res) {
    let data = {
        message: 'Hello World!'
    };
    res.status(200).send(data);
});

app.post('/fetch_data', function(req, res) {
    let data = {
        response: 'You sent: ' + req.body.message
    };

// Port Listen
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
