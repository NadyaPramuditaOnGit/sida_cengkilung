// /controllers/guestPenduduk/dataDesaController.js

const db = require('../../config/db');

/**
 * ===============================
 * GET DATA DESA PER JENIS
 * ===============================
 * Endpoint: GET /api/data-desa?jenis=Kependudukan
 * 
 * Digunakan di halaman "Info Desa Adat" → tab seperti:
 * - Kependudukan, Agama, Pekerjaan, Pendidikan, Usia, dll
 * 
 * Output:
 * - Setiap baris mencakup: jenis_data, jumlah_laki, jumlah_perempuan, total
 * - Data digunakan untuk isi tabel utama di halaman frontend
 */
exports.getDataDesaByJenis = async (req, res) => {
  const { jenis } = req.query;

  if (!jenis) {
    return res.status(400).json({ error: 'Parameter jenis wajib diisi.' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT 
        id_data,
        jenis_data,
        jumlah_laki,
        jumlah_perempuan,
        (jumlah_laki + jumlah_perempuan) AS total,
        tahun,
        keterangan,
        diperbarui_pada
      FROM data_desa
      WHERE jenis_data = ?
      ORDER BY id_data ASC
    `, [jenis]);

    res.json({ data: rows });
  } catch (error) {
    console.error('[GET DATA DESA]', error);
    res.status(500).json({ error: 'Gagal mengambil data desa.' });
  }
};


/**
 * ===============================
 * GET TOTAL AKUMULASI DATA DESA
 * ===============================
 * Endpoint: GET /api/data-desa/total?jenis=Kependudukan
 * 
 * Output:
 * - total_laki: jumlah semua laki-laki
 * - total_perempuan: jumlah semua perempuan
 * - total: total keseluruhan penduduk
 * 
 * Digunakan frontend untuk baris TOTAL di bawah tabel.
 */
exports.getTotalDataDesaByJenis = async (req, res) => {
  const { jenis } = req.query;

  if (!jenis) {
    return res.status(400).json({ error: 'Parameter jenis wajib diisi.' });
  }

  try {
    const [rows] = await db.execute(`
      SELECT 
        SUM(jumlah_laki) AS total_laki,
        SUM(jumlah_perempuan) AS total_perempuan,
        SUM(jumlah_laki + jumlah_perempuan) AS total
      FROM data_desa
      WHERE jenis_data = ?
    `, [jenis]);

    res.json({ total: rows[0] });
  } catch (error) {
    console.error('[GET TOTAL DATA DESA]', error);
    res.status(500).json({ error: 'Gagal mengambil total data desa.' });
  }
};
