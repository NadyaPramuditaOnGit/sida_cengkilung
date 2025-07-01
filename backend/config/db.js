const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketPath: '/tmp/mysql.sock'
});

module.exports = db;