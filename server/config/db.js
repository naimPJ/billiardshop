require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'billiardshop.mysql.database.azure.com',
  user: process.env.DB_USER || 'naim',
  password: process.env.DB_PASSWORD || 'Naim2410',
  database: process.env.DB_NAME || 'billiardshop',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 60000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kreiranje promise wrapper-a za pool
const promisePool = pool.promise();

// Test konekcije
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Greška pri povezivanju sa bazom:', err);
    return;
  }
  console.log('Uspješno povezano sa bazom podataka!');
  console.log('Host:', process.env.DB_HOST || 'billiardshop.mysql.database.azure.com');
  console.log('Database:', process.env.DB_NAME || 'billiardshop');
  connection.release();
});

module.exports = promisePool; 