
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');

var path = require('path');
const VIEWS = path.join(__dirname, 'views');
	
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;
    
Object.assign=require('object-assign')

app.set('views', VIEWS);
app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
     res.render('index.html', { root : VIEWS });
});

app.get("/contact", function (req, res) {
  res.sendFile('contact.html', { root : VIEWS });
 });

app.get("/about", function (req, res) {
  res.sendFile('about.html', { root : VIEWS });
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
