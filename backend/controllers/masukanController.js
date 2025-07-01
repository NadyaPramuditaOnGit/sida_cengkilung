const db = require('../config/db');

// === GET semua masukan
exports.getAllMasukan = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM masukan_warga
      ORDER BY dibuat_pada DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET MASUKAN]', error);
    res.status(500).json({ error: 'Gagal mengambil data masukan.' });
  }
};

// === GET masukan by ID
exports.getMasukanById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM masukan_warga WHERE id_masukan = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Masukan tidak ditemukan.' });
    res.json(rows[0]);
  } catch (error) {
    console.error('[GET MASUKAN BY ID]', error);
    res.status(500).json({ error: 'Gagal mengambil detail masukan.' });
  }
};

// === POST kirim masukan
exports.createMasukan = async (req, res) => {
  const { nama, email, no_hp, subjek, pesan } = req.body;
  const alamat_ip = req.ip;

  if (!nama || !email || !subjek || !pesan) {
    return res.status(400).json({ error: 'Field wajib belum lengkap.' });
  }

  try {
    await db.execute(
      `INSERT INTO masukan_warga 
      (nama, email, no_hp, subjek, pesan, alamat_ip) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nama, email, no_hp || null, subjek, pesan, alamat_ip]
    );
    res.status(201).json({ message: 'Masukan berhasil dikirim.' });
  } catch (error) {
    console.error('[CREATE MASUKAN]', error);
    res.status(500).json({ error: 'Gagal mengirim masukan.' });
  }
};

// === PUT tanggapi masukan
exports.respondMasukan = async (req, res) => {
  const { id } = req.params;
  const { status, tanggapan } = req.body;

  try {
    const [check] = await db.execute(
      `SELECT id_masukan FROM masukan_warga WHERE id_masukan = ?`,
      [id]
    );
    if (check.length === 0) return res.status(404).json({ error: 'Masukan tidak ditemukan.' });

    await db.execute(
      `UPDATE masukan_warga SET status = ?, tanggapan = ? WHERE id_masukan = ?`,
      [status || 'Diproses', tanggapan || null, id]
    );
    res.json({ message: 'Tanggapan berhasil dikirim.' });
  } catch (error) {
    console.error('[RESPOND MASUKAN]', error);
    res.status(500).json({ error: 'Gagal menanggapi masukan.' });
  }
};

// === DELETE masukan
exports.deleteMasukan = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await db.execute(
      `SELECT id_masukan FROM masukan_warga WHERE id_masukan = ?`,
      [id]
    );
    if (check.length === 0) return res.status(404).json({ error: 'Masukan tidak ditemukan.' });

    await db.execute(`DELETE FROM masukan_warga WHERE id_masukan = ?`, [id]);
    res.json({ message: 'Masukan berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE MASUKAN]', error);
    res.status(500).json({ error: 'Gagal menghapus masukan.' });
  }
};
