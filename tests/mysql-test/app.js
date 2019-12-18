//app.js

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

connection.query('SELECT SYSDATE()', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

connection.end();
