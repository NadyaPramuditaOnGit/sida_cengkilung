const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const db = mysql.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      socketPath: '/tmp/mysql.sock' // ✅ sesuai hasil dari mysqladmin
    });
    console.log('✅ Terhubung ke database!');
    const [rows] = await db.execute('SELECT 1');
    console.log(rows);
    await db.end();
  } catch (err) {
    console.error('❌ Gagal koneksi:', err);
  }
}

testConnection();
