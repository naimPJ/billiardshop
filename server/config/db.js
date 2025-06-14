require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'billiardshop.mysql.database.azure.com',
  user: process.env.DB_USER || 'naim@billiardshop',
  password: process.env.DB_PASSWORD || 'Naim2410',
  database: process.env.DB_NAME || 'billiardshop',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 120000,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Kreiranje promise wrapper-a za pool
const promisePool = pool.promise();

// Test konekcije sa više detalja
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Detalji greške pri povezivanju sa bazom:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      host: process.env.DB_HOST || 'billiardshop.mysql.database.azure.com',
      user: process.env.DB_USER || 'naim@billiardshop',
      database: process.env.DB_NAME || 'billiardshop'
    });
    return;
  }
  console.log('Uspješno povezano sa bazom podataka!');
  console.log('Host:', process.env.DB_HOST || 'billiardshop.mysql.database.azure.com');
  console.log('Database:', process.env.DB_NAME || 'billiardshop');
  connection.release();
});

module.exports = promisePool; 