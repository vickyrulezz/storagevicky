const http = require('http');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'custom-mysql.gamification.svc.cluster.local',
  user: 'xxuser',
  password: 'welcome1',
  database: 'sampledb'
});

//html string that will be send to browser
var resulthtml ='<html><head><title>Kool App - Andromeda Product Page</title></head><body><h1>Product Details</h1>{${table}}</body></html>';

var commodity_name = process.argv[2]; // pass argument to query
var sql = '';
var table = '';
console.log(sql);


var setResHtml;
var extract_data;

module.exports = {
	
	setResHtml: 
	function (sql, cb){
		console.log("We are in setResHtml");
		connection.connect((err) => {
		  if (err) throw err;
		  console.log('Connected!');
		});
		
		sql = `select XXPC.COMMODITY_NAME PRODUCT_TYPE, XXSKU.ITEM_NUMBER SKU, XXPS.BRAND ,XXSKU.DESCRIPTION,XXSKU.LONG_DESCRIPTION, 
			XXPR.LIST_PRICE,XXSKU.SKU_ATTRIBUTE_VALUE1 SIZE,XXSKU.SKU_ATTRIBUTE_VALUE2 COLOR,XXPR.IN_STOCK from 
			XXIBM_PRODUCT_SKU XXSKU,XXIBM_PRODUCT_PRICING XXPR,XXIBM_PRODUCT_STYLE XXPS,XXIBM_PRODUCT_CATALOGUE XXPC
			where XXSKU.ITEM_NUMBER = XXPR.ITEM_NUMBER
			and XXSKU.STYLE_ITEM = XXPS.ITEM_NUMBER
			AND XXSKU.CATALOGUE_CATEGORY=XXPC.COMMODITY`
			//AND XXPC.COMMODITY_NAME = '` + commodity_name +`'` ;
		connection.query(sql, function(err, res, fields) {
		  if (!err){
			//console.log('The solution is: ', res);
			 // if there is no error, you have the result
				// iterate for all the rows in result
				console.log("Executing query !!!");
				
				Object.keys(res).forEach(function(key) {
				  var row = res[key];
				  console.log(row.PRODUCT_TYPE +`|`+ row.SKU +`|`+ row.BRAND +`|`+ row.DESCRIPTION +`|`+ row.LONG_DESCRIPTION +`|`+ row.LIST_PRICE
					+`|`+ row.SIZE +`|`+ row.COLOR +`|`+ row.IN_STOCK) 
					});
				for(var i=0; i<res.length; i++){
					table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].PRODUCT_TYPE +'</td><td>'+ res[i].SKU +'</td><td>'+ res[i].BRAND +'</td><td>'+ res[i].DESCRIPTION +'</td><td>'+ res[i].LONG_DESCRIPTION +'</td><td>'+ res[i].LIST_PRICE +'</td><td>'+ res[i].SIZE +'</td><td>'+ res[i].COLOR+'</td><td>'+ res[i].IN_STOCK +'</td></tr>';
					}
					table ='<table border="1"><tr><th>Sr No.</th><th>PRODUCT_TYPE</th><th>SKU</th><th>BRAND</th><th>DESCRIPTION</th><th>LONG_DESCRIPTION</th><th>LIST_PRICE</th><th>SIZE</th><th>COLOR</th><th>IN_STOCK</th></tr>'+ table +'</table>';
									
					resulthtml = resulthtml.replace('{${table}}', table);
					
					console.log(resulthtml);
					//return cb(resulthtml);
					
					return resulthtml;
		
					connection.end();
		  }
		  else
		  {
			console.log('Error while performing Query.');
			console.log(err);
			return null;
			connection.end();
		  }
		});
	}
	,
	extract_data: 
	function(req, res, next) {
		console.log("We are in extract_data");
		module.exports.setResHtml();
		console.log("extract_data ends !!!!");
		//return resulthtml;
	
	
  }

 }
