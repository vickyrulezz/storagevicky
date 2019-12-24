
const http = require('http');
const mysql = require('mysql');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	;

/*
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
*/

const pool = mysql.createPool({
  host: "custom-mysql.gamification.svc.cluster.local",
  user: "xxuser",
  password: "welcome1",
  database: "sampledb"
});

	console.log(pool);

//html string that will be send to browser
var resulthtml ='<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

var sql ='select XXSKU.ITEM_NUMBER SKU, XXSKU.DESCRIPTION,XXPR.LIST_PRICE from XXIBM_PRODUCT_SKU XXSKU,XXIBM_PRODUCT_PRICING XXPR,XXIBM_PRODUCT_STYLE XXPS,XXIBM_PRODUCT_CATALOGUE XXPC where XXSKU.ITEM_NUMBER = XXPR.ITEM_NUMBER and XXSKU.STYLE_ITEM = XXPS.ITEM_NUMBER AND XXSKU.CATALOGUE_CATEGORY=XXPC.COMMODITY';

	console.log(sql);

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
/*
function setResHtml(sql, cb){
	console.log("We are in setResHtml");
  
pool.getConnection((err, con)=>{
    if(err) throw err;
	
    con.query(sql, (err, res, cols)=>{
      if(err) throw err;
		console.log("Connected and executing query");
	    
      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].SKU +'</td><td>'+ res[i].DESCRIPTION +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Nr.</th><th>Name</th><th>Address</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

	resulthtml = resulthtml.replace('{${table}}', table);
      //return cb(table);
	    return cb(resulthtml);
    });
  });
}

module.exports = {
	setResHtml : setResHtml
}
*/

var setResHtml;
var extract_data;

module.exports = {

  setResHtml: function (sql, cb){
	console.log("We are in setResHtml");
  
	pool.getConnection((err, con)=>{
    if(err) throw err;
	console.log("Connected !!!");
		    
    con.query(sql, (err, res, cols)=>{
      if(err) throw err;
		console.log("Executing query !!!");
	    
      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].SKU +'</td><td>'+ res[i].DESCRIPTION +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Nr.</th><th>Name</th><th>Address</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

	resulthtml = resulthtml.replace('{${table}}', table);
      //return cb(table);
	   return cb(resulthtml);
    });
  });
}
,	
  extract_data: function(req, res, next) {
	console.log("We are in extract_data");
    module.exports.setResHtml();
  }
}

//module.exports = async () 
/*
module.exports = function extract_data()
{
	console.log("We are in module exports !!!");
        let extracted_data;
            //extracted_data = await setResHtml(sql, resql=>
		extracted_data = setResHtml(sql, resql=>
			{		  
				reo = reo.replace('{${table}}', resql);
			});

        return extracted_data; 
}
*/

