
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");

const http = require('http');

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
//app.get("/fetch_data", function (req, res) {
  //res.sendFile('fetch_data.js', { root : VIEWS });


//GET ALL PRODUCTS - To retrieve all all products call this API ... URL/api/getproducts
app.get('/get_all_products',(req, res) => {
let sql = `select XXPC.COMMODITY_NAME PRODUCT_TYPE, XXSKU.ITEM_NUMBER SKU, XXPS.BRAND ,XXSKU.DESCRIPTION,XXSKU.LONG_DESCRIPTION, 
XXPR.LIST_PRICE,XXSKU.SKU_ATTRIBUTE_VALUE1 SIZE,XXSKU.SKU_ATTRIBUTE_VALUE2 COLOR,XXPR.IN_STOCK from 
XXIBM_PRODUCT_SKU XXSKU,
XXIBM_PRODUCT_PRICING XXPR,
XXIBM_PRODUCT_STYLE XXPS,
XXIBM_PRODUCT_CATALOGUE XXPC
where XXSKU.ITEM_NUMBER = XXPR.ITEM_NUMBER
and XXSKU.STYLE_ITEM = XXPS.ITEM_NUMBER
AND XXSKU.CATALOGUE_CATEGORY=XXPC.COMMODITY`;
    
console.log(sql);
  let query = mysqlClient.query(sql, (err, results) => {
    if(err) throw err;
	json_data = JSON.stringify(results);
	fetchContents(json_data);
	console.log("-----------------------------------------------------------------------------------------------");
	//console.log(json_data);
	console.log("-----------------------------------------------------------------------------------------------");
	
    //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

function fetchContents(contents){
 return new Promise(function(resolve, reject) {
    console.log("Iterating through the 'result' array of objects to be displayed in table");
    _.forEach(contents.result,function(value,key){
      // logger.debug("Ticket Numbers: " + value.number);
      tableHtml = tableHtml+'<tr>'+
      '<td>'+value.PRODUCT_TYPE+'</td>'+
      '<td>'+value.SKU+'</td>'+
      '<td>'+value.BRAND+'</td>'+
      '<td>'+value.DESCRIPTION+'</td>'+
	  '<td>'+value.LONG_DESCRIPTION+'</td>'+
	  '<td>'+value.LIST_PRICE+'</td>'+
	  '<td>'+value.SIZE+'</td>'+
	  '<td>'+value.COLOR+'</td>'+
	  '<td>'+value.IN_STOCK+'</td>'+
      '</tr>';
	  console.log(tableHtml);
    })
    resolve();
 })
}

function createReport(){
  return new Promise(function(resolve, reject) {
   var html = createHTML({
    title: "Offender Configuration Items - " + (new Date().toUTCString()),
      scriptAsync: true,
      css: '',
      script: '',
      lang: 'en',
      dir: 'ltr',
      head: '<meta charset="utf-8">'+
      '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">'+
      '<meta name="description" content="">'+
      '<meta name="author" content="">'+
      '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.12/css/all.css" integrity="sha384-G0fIWCsCzJIMAVNQPfjH08cyYaUtMwjJwqiRKxxE/rx96Uroj1BtIQ6MLJuheaO9" crossorigin="anonymous">'+
      '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">'+
      '<style>'+
      'html {position: relative; min-height: 100%;}'+
      'body {margin-bottom: 60px; /* Margin bottom by footer height */}'+
      '.footer {position: absolute; bottom: 0; width: 100%; height: 60px;  line-height: 60px;  background-color: #f5f5f5;}'+
      '.container {width: auto; min-width: 992px; padding: 0 15px;}'+
      '</style>',
      body: '<main role="main" class="container">'+
      '<h1 class="mt-5">'+ 'Chronic devices with same symptoms repeating for more than 5 times in 24hrs.'+'</h1>'+
      '<div class="alert alert-primary" role="alert">Note: Count of duplicate tickets mentioned in summary and number of related incidents might vary</div>'+
      '<table class="table table-hover">'+
          '<thead>'+
          '<th scope="col">Number</th>'+
          '<th scope="col">Related Incidents</th>'+
          '<th scope="col">Configuration Item</th>'+
          '<th scope="col">Summary</th>'+
          '<th scope="col">Company</th>'+
          '</thead>'+
          '<tbody>'+
          tableHtml +
          '</tbody>'+
      '</table>'+
      '</main>'+
      '<footer class="footer">'+
          '<div class="container">'+
              '<span class="text-muted">Report Generated: '+date.toUTCString()+
              '</span>'+
              '<br>'+
              '<span class="text-muted">Chronic Group Report</span>'+
          '</div>'+
      '</footer>'
    })
    resolve(html);
  })
}








	
//create the server for browser access
const server = http.createServer((req, res)=>{
   //if (req.url == '/fetch_data'){
	console.log("Creating Server .....");
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(global.resultpage, 'utf-8');
    res.end();
   //}
	});


// Port Listen
app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
