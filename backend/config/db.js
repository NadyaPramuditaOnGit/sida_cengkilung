// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'desa_adat_cengkilung_db',
  port: parseInt(process.env.DB_PORT) || 3307
};

const pool = mysql.createPool(dbConfig);

module.exports = {pool};