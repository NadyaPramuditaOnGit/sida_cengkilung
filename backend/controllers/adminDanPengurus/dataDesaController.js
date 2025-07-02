const db = require('../../config/db');

// Ambil semua data berdasarkan jenis_data (misal: Kependudukan, Agama, dsb)
exports.getDataDesaByJenis = async (req, res) => {
  const { jenis } = req.query;

  try {
    const [rows] = await db.execute(`
      SELECT id_data, jenis_data, jumlah_laki, jumlah_perempuan, total, tahun, keterangan, diperbarui_pada
      FROM data_desa
      WHERE jenis_data = ?
      ORDER BY id_data ASC
    `, [jenis]);

    // 👇 Hitung total agregat
    const totalLaki = rows.reduce((sum, row) => sum + (row.jumlah_laki || 0), 0);
    const totalPerempuan = rows.reduce((sum, row) => sum + (row.jumlah_perempuan || 0), 0);

    res.json({
      data: rows,
      total_laki: totalLaki,
      total_perempuan: totalPerempuan
    });
  } catch (error) {
    console.error('[GET DATA DESA]', error);
    res.status(500).json({ error: 'Gagal mengambil data desa.' });
  }
};


// Tambah data desa
exports.createDataDesa = async (req, res) => {
  const { jenis_data, jumlah_laki, jumlah_perempuan, tahun, keterangan } = req.body;
  const diperbarui_oleh = req.user.id;

  if (!jenis_data || !tahun) {
    return res.status(400).json({ error: 'Jenis data dan tahun wajib diisi.' });
  }

  try {
    await db.execute(`
      INSERT INTO data_desa (jenis_data, jumlah_laki, jumlah_perempuan, tahun, keterangan, diperbarui_oleh)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [jenis_data, jumlah_laki || 0, jumlah_perempuan || 0, tahun, keterangan || '', diperbarui_oleh]);

    res.status(201).json({ message: 'Data desa berhasil ditambahkan.' });
  } catch (error) {
    console.error('[CREATE DATA DESA]', error);
    res.status(500).json({ error: 'Gagal menambahkan data desa.' });
  }
};

// Perbarui data desa
exports.updateDataDesa = async (req, res) => {
  const { id } = req.params;
  const { jumlah_laki, jumlah_perempuan, tahun, keterangan } = req.body;
  const diperbarui_oleh = req.user.id;

  try {
    const [cek] = await db.execute(`SELECT * FROM data_desa WHERE id_data = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan.' });

    await db.execute(`
      UPDATE data_desa SET
        jumlah_laki = ?, jumlah_perempuan = ?, tahun = ?, keterangan = ?, diperbarui_oleh = ?
      WHERE id_data = ?
    `, [jumlah_laki || 0, jumlah_perempuan || 0, tahun, keterangan, diperbarui_oleh, id]);

    res.json({ message: 'Data desa berhasil diperbarui.' });
  } catch (error) {
    console.error('[UPDATE DATA DESA]', error);
    res.status(500).json({ error: 'Gagal memperbarui data desa.' });
  }
};

// Hapus data desa
exports.deleteDataDesa = async (req, res) => {
  const { id } = req.params;

  try {
    const [cek] = await db.execute(`SELECT * FROM data_desa WHERE id_data = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Data tidak ditemukan.' });

    await db.execute(`DELETE FROM data_desa WHERE id_data = ?`, [id]);

    res.json({ message: 'Data desa berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE DATA DESA]', error);
    res.status(500).json({ error: 'Gagal menghapus data desa.' });
  }
};
