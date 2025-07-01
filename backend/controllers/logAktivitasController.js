const db = require('../config/db');

// === GET semua log aktivitas
exports.getAllLogs = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT l.*, p.nama_lengkap AS nama_pengguna
      FROM log_aktivitas l
      JOIN pengguna p ON l.id_pengguna = p.id_pengguna
      ORDER BY l.waktu DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET ALL LOGS]', error);
    res.status(500).json({ error: 'Gagal mengambil data log aktivitas.' });
  }
};

// === GET log aktivitas berdasarkan ID pengguna
exports.getLogsByUser = async (req, res) => {
  const { id_pengguna } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM log_aktivitas WHERE id_pengguna = ? ORDER BY waktu DESC`,
      [id_pengguna]
    );
    res.json(rows);
  } catch (error) {
    console.error('[GET LOGS BY USER]', error);
    res.status(500).json({ error: 'Gagal mengambil log aktivitas pengguna.' });
  }
};

// === POST log aktivitas
exports.createLog = async (req, res) => {
  const { id_pengguna, aktivitas } = req.body;
  const ip = req.ip;
  const userAgent = req.get('user-agent');

  if (!id_pengguna || !aktivitas) {
    return res.status(400).json({ error: 'Field id_pengguna dan aktivitas wajib diisi.' });
  }

  try {
    await db.execute(
      `INSERT INTO log_aktivitas (id_pengguna, aktivitas, ip_address, user_agent) VALUES (?, ?, ?, ?)`,
      [id_pengguna, aktivitas, ip, userAgent]
    );
    res.status(201).json({ message: 'Log aktivitas berhasil dicatat.' });
  } catch (error) {
    console.error('[CREATE LOG]', error);
    res.status(500).json({ error: 'Gagal mencatat log aktivitas.' });
  }
};
