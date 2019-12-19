var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
	
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;
	
app.get('/', function (req, res) {
res.render('index');
});


	
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
