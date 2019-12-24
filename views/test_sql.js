//app.js
const http = require('http');
const mysql = require('mysql');
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

let commodity_name = process.argv[2]; // pass argument to query
let sql = `select XXPC.COMMODITY_NAME PRODUCT_TYPE, XXSKU.ITEM_NUMBER SKU, XXPS.BRAND ,XXSKU.DESCRIPTION,XXSKU.LONG_DESCRIPTION, 
XXPR.LIST_PRICE,XXSKU.SKU_ATTRIBUTE_VALUE1 SIZE,XXSKU.SKU_ATTRIBUTE_VALUE2 COLOR,XXPR.IN_STOCK from 
XXIBM_PRODUCT_SKU XXSKU,
XXIBM_PRODUCT_PRICING XXPR,
XXIBM_PRODUCT_STYLE XXPS,
XXIBM_PRODUCT_CATALOGUE XXPC
where XXSKU.ITEM_NUMBER = XXPR.ITEM_NUMBER
and XXSKU.STYLE_ITEM = XXPS.ITEM_NUMBER
AND XXSKU.CATALOGUE_CATEGORY=XXPC.COMMODITY
AND XXPC.COMMODITY_NAME = '` + commodity_name +`'` ;

console.log(sql);

connection.query(sql, function(err, results, fields) {
  if (!err)
    //console.log('The solution is: ', results);
	 // if there is no error, you have the result
		// iterate for all the rows in result
		Object.keys(results).forEach(function(key) {
		  var row = results[key];
		  console.log(row.PRODUCT_TYPE +`|`+ row.SKU +`|`+ row.BRAND +`|`+ row.DESCRIPTION +`|`+ row.LONG_DESCRIPTION +`|`+ row.LIST_PRICE
			+`|`+ row.SIZE +`|`+ row.COLOR +`|`+ row.IN_STOCK) 
	});
  else
    console.log('Error while performing Query.');
});

connection.end();
