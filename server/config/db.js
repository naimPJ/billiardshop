const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root717',
  database: 'billiardshop',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kreiranje promise wrapper-a za pool
const promisePool = pool.promise();

module.exports = promisePool; 