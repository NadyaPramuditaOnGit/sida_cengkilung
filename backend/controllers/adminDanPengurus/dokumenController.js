const db = require('../../config/db');
const path = require('path');

// Ambil semua dokumen dengan pagination
exports.getDokumenList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limitInt = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limitInt;
  
    try {
      const query = `
        SELECT id_dokumen, judul, tanggal_modifikasi, tanggal_dokumen, lokasi_file, kategori
        FROM dokumen_desa
        ORDER BY tanggal_modifikasi DESC
        LIMIT ${limitInt} OFFSET ${offset}
      `;
      const [rows] = await db.execute(query); // tanpa parameter binding untuk limit & offset
  
      res.json(rows);
    } catch (error) {
      console.error('[GET DOKUMEN]', error);
      res.status(500).json({ error: 'Gagal mengambil dokumen.' });
    }
};

exports.getDokumenById = async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await db.execute(
        'SELECT id_dokumen, judul, tanggal_modifikasi, tanggal_dokumen, lokasi_file, kategori FROM dokumen_desa WHERE id_dokumen = ?',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('[GET DOKUMEN BY ID]', error);
      res.status(500).json({ error: 'Gagal mengambil data dokumen.' });
    }
};

// Tambah dokumen
exports.createDokumen = async (req, res) => {
  const { judul, tanggal_dokumen, kategori } = req.body;
  const lokasi_file = req.file ? `/uploads/dokumen/${req.file.filename}` : null;
  const diunggah_oleh = req.user.id;

  if (!judul || !tanggal_dokumen || !kategori || !lokasi_file) {
    return res.status(400).json({ error: 'Semua field wajib diisi dan file harus diunggah.' });
  }

  try {
    await db.execute(`
      INSERT INTO dokumen_desa (judul, tanggal_dokumen, lokasi_file, kategori, diunggah_oleh)
      VALUES (?, ?, ?, ?, ?)`,
      [judul, tanggal_dokumen, lokasi_file, kategori, diunggah_oleh]
    );

    res.status(201).json({ message: 'Dokumen berhasil ditambahkan.' });
  } catch (error) {
    console.error('[CREATE DOKUMEN]', error);
    res.status(500).json({ error: 'Gagal menambahkan dokumen.' });
  }
};

// Update dokumen
exports.updateDokumen = async (req, res) => {
  const { id } = req.params;
  const { judul, tanggal_dokumen, kategori } = req.body;
  const lokasi_file = req.file ? `/uploads/dokumen/${req.file.filename}` : null;

  try {
    const [cek] = await db.execute(`SELECT * FROM dokumen_desa WHERE id_dokumen = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });

    await db.execute(`
      UPDATE dokumen_desa SET
        judul = ?, tanggal_dokumen = ?, kategori = ?,
        lokasi_file = IFNULL(?, lokasi_file), tanggal_modifikasi = CURRENT_TIMESTAMP
      WHERE id_dokumen = ?`,
      [judul, tanggal_dokumen, kategori, lokasi_file, id]
    );

    res.json({ message: 'Dokumen berhasil diperbarui.' });
  } catch (error) {
    console.error('[UPDATE DOKUMEN]', error);
    res.status(500).json({ error: 'Gagal memperbarui dokumen.' });
  }
};

// Hapus dokumen
exports.deleteDokumen = async (req, res) => {
  const { id } = req.params;

  try {
    const [cek] = await db.execute(`SELECT * FROM dokumen_desa WHERE id_dokumen = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Dokumen tidak ditemukan.' });

    await db.execute(`DELETE FROM dokumen_desa WHERE id_dokumen = ?`, [id]);
    res.json({ message: 'Dokumen berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE DOKUMEN]', error);
    res.status(500).json({ error: 'Gagal menghapus dokumen.' });
  }
};

  
