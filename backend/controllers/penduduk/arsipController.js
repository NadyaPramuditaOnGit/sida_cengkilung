const db = require('../../config/db');

/**
 * Ambil daftar dokumen kategori 'Arsip' dengan pagination khusus pengguna (warga).
 * Mengembalikan: currentPage, perPage, total data, dan array data dokumen.
 */
exports.getArsipDesa = async (req, res) => {
  // Validasi dan konversi query param page & limit
  const page = Math.max(1, Math.floor(Number(req.query.page))) || 1;
  const limit = Math.max(1, Math.floor(Number(req.query.limit))) || 10;
  const offset = (page - 1) * limit;

  try {
    // Ambil total jumlah dokumen untuk kategori 'Arsip' (untuk pagination)
    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM dokumen_desa WHERE kategori = 'Arsip'`
    );
    const total = countRows[0].total;

    // Ambil data dokumen dengan pagination
    const sql = `
      SELECT id_dokumen, judul, tanggal_modifikasi, tanggal_dokumen, lokasi_file
      FROM dokumen_desa
      WHERE kategori = 'Arsip'
      ORDER BY tanggal_modifikasi DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const [rows] = await db.execute(sql);

    // Tambahkan nomor urut 'no' berdasarkan offset
    const dataWithNo = rows.map((row, idx) => ({
      no: offset + idx + 1,
      ...row,
    }));

    // Kirim response JSON
    res.json({
      currentPage: page,
      perPage: limit,
      total,
      data: dataWithNo,
    });
  } catch (err) {
    console.error('[GET ARSIP DESA - PENGGUNA]', err);
    res.status(500).json({ error: 'Gagal mengambil data arsip desa.' });
  }
};
