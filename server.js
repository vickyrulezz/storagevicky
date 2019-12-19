var express = require('express'),
    app     = express();
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
      res.render('index.html');
});
