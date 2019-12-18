//app.js

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'mysql',
  user: 'biplab',
  password: 'biplab@2019',
  database: 'sampledb'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
