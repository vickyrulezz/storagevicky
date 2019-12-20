
const http = require('http');
const mysql = require('mysql');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;

const connection = mysql.createConnection({
  host: 'custom-mysql.gamification.svc.cluster.local',
  user: 'xxuser',
  password: 'welcome1',
  database: 'sampledb'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

//html string that will be send to browser
var reo ='<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

let sql ='select XXSKU.ITEM_NUMBER SKU, XXSKU.DESCRIPTION,XXPR.LIST_PRICE from XXIBM_PRODUCT_SKU XXSKU,XXIBM_PRODUCT_PRICING XXPR,XXIBM_PRODUCT_STYLE XXPS,XXIBM_PRODUCT_CATALOGUE XXPC where XXSKU.ITEM_NUMBER = XXPR.ITEM_NUMBER and XXSKU.STYLE_ITEM = XXPS.ITEM_NUMBER AND XXSKU.CATALOGUE_CATEGORY=XXPC.COMMODITY';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
	alert("we are in setResHtml");
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].SKU +'</td><td>'+ res[i].DESCRIPTION +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Nr.</th><th>Name</th><th>Address</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

//server.listen(8080, ()=>{
server.listen(port, ()=>{
  console.log('Server running at //localhost:8080/');
});

