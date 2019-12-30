
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");

const http = require('http');
var fs = require("fs");

var path = require('path');
const VIEWS = path.join(__dirname, 'views');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;

// HTML Table presentation
var _ = require('lodash');
var createHTML = require('create-html');
var tableHtml = "";
var date = new Date();
var json_data = "";
//html string that will be send to browser
var table = "";
var resulthtml ='<html><head><title>Kool App - Andromeda Product Page</title></head><body>{${table}}</body></html>';
//var resulthtml ='';
var searchParam = '';

// Using JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

Object.assign=require('object-assign')

app.set('views', VIEWS);
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//mysql configuration - Gamification project mysql connect details
var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || 'custom-mysql.gamification.svc.cluster.local';
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
var mysqlUser = 'xxuser'; 
var mysqlPass = 'welcome1';
var mysqlDb = 'sampledb';


//form the connection string to connect to mysql - you can connect directly too 
var mysqlString = 'mysql://' + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;
console.log(mysqlString);

//connect to mysql/sampledb database
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function (err) {
    if (err) console.log(err);
});

//GET DB STATUS - To validate if database is running call this API ... URL/isdbon
app.get('/api/status/db', function (req, res) {
    mysqlClient.query('SELECT 0 + 0 AS status', function (err, rows, fields) {
        if (err) {
            res.send('MYSQL IS NOT CONNECTED' + JSON.stringify(err));
        } else {
            res.send('MYSQL IS CONNECTED - Status Msg: ' + rows[0].status);
        }
    });
});


// Getting all the pages/elements
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

app.get("/getallproducts", function (req, res) {
  res.sendFile('allproducts.html', { root : VIEWS });
  searchParam = req.query.txtSearch;
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


//GET ALL PRODUCTS - To retrieve all all products call this API ... URL/get_all_products
app.get('/get_all_products',funtion(req, res) => {
	
let sql = `select XXPC.COMMODITY_NAME PRODUCT_TYPE, XXSKU.ITEM_NUMBER SKU, XXPS.BRAND ,XXSKU.DESCRIPTION,XXSKU.LONG_DESCRIPTION, 
XXPR.LIST_PRICE,XXSKU.SKU_ATTRIBUTE_VALUE1 SIZE,XXSKU.SKU_ATTRIBUTE_VALUE2 COLOR,XXPR.IN_STOCK from 
XXIBM_PRODUCT_SKU XXSKU,
XXIBM_PRODUCT_PRICING XXPR,
XXIBM_PRODUCT_STYLE XXPS,
XXIBM_PRODUCT_CATALOGUE XXPC
where XXSKU.ITEM_NUMBER = XXPR.ITEM_NUMBER
and XXSKU.STYLE_ITEM = XXPS.ITEM_NUMBER
AND XXSKU.CATALOGUE_CATEGORY=XXPC.COMMODITY
AND (upper(XXSKU.ITEM_NUMBER) like upper('%`+searchParam+`%') 
OR upper(XXPC.COMMODITY_NAME) like upper('%`+searchParam+`%') 
OR upper(XXSKU.DESCRIPTION) like upper('%`+searchParam+`%') 
OR upper(XXSKU.LONG_DESCRIPTION) like upper('%`+searchParam+`%')
)`;
    
console.log(sql);
  let query = mysqlClient.query(sql, (err, results, columns) => {
    if(err) throw err;
	
	for(var i=0; i<results.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ results[i].PRODUCT_TYPE +'</td><td>'+ results[i].SKU +'</td><td>'+ results[i].BRAND +'</td><td>'+ results[i].DESCRIPTION +'</td><td>'+ results[i].LONG_DESCRIPTION +'</td><td>'+ results[i].LIST_PRICE +'</td><td>'+ results[i].SIZE +'</td><td>'+ results[i].COLOR+'</td><td>'+ results[i].IN_STOCK +'</td></tr>';
      	//console.log((i+1)+'|'+results[i].PRODUCT_TYPE+'|'+results[i].SKU+'|'+results[i].BRAND+'|'+results[i].DESCRIPTION);
	}
      table ='<table border="1" bgcolor=" #ffffcc"><tr><th>Sr No.</th><th>PRODUCT_TYPE</th><th>SKU</th><th>BRAND</th><th>DESCRIPTION</th><th>LONG_DESCRIPTION</th><th>LIST_PRICE</th><th>SIZE</th><th>COLOR</th><th>IN_STOCK</th></tr>'+ table +'</table>';
	resulthtml = resulthtml.replace('{${table}}', table);
	console.log(resulthtml);
    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	//res.render('allproducts.html', { root : VIEWS , data : resulthtml})
	res.send(resulthtml);
  });
	
});




//create the server for browser access
var server = http.createServer((req, res)=>{
	console.log("Creating Server .....");
	if (req.url === "/get_all_products") {
        fs.readFile('allproducts.html', { root : VIEWS }, function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(resulthtml);
            }
             
            resp.end();
        });
    } 
});
	



// Port Listen
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
