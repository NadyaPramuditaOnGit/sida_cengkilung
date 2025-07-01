// controllers/guestPenduduk/galeriDesaController.js

const db = require('../../config/db');

/**
 * ===============================
 * GET FOTO SECTION
 * ===============================
 * Menampilkan galeri foto desa:
 * - Tersedia filter kategori: Keagamaan, Kesenian, Lainnya, Semua
 * - Pagination: 6 per halaman
 * - Format respons: judul, lokasi_file, kategori, tanggal_upload
 */
exports.getFotoSection = async (req, res) => {
  const kategori = req.query.kategori || 'Semua';
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    // Siapkan query dan parameter dasar
    let whereClause = `jenis_media = ?`;
    const params = ['Foto'];

    // Tambahkan kondisi berdasarkan kategori
    if (kategori === 'Keagamaan' || kategori === 'Kesenian') {
      whereClause += ` AND kategori = ?`;
      params.push(kategori);
    } else if (kategori === 'Lainnya') {
      whereClause += ` AND kategori NOT IN (?, ?)`;
      params.push('Keagamaan', 'Kesenian');
    }

    // Ambil data galeri sesuai filter dan pagination
    const [data] = await db.execute(
      `SELECT id_galeri, judul, lokasi_file, kategori, tanggal_upload
       FROM galeri_desa
       WHERE ${whereClause}
       ORDER BY tanggal_upload DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    // Hitung total data untuk pagination
    const [totalRows] = await db.execute(
      `SELECT COUNT(*) AS total FROM galeri_desa WHERE ${whereClause}`,
      params
    );

    res.json({
      page,
      limit,
      total: totalRows[0].total,
      totalPages: Math.ceil(totalRows[0].total / limit),
      data
    });
  } catch (error) {
    console.error('[GET GALERI FOTO]', error);
    res.status(500).json({ error: 'Gagal mengambil galeri foto.' });
  }
};

/**
 * ===============================
 * GET VIDEO SECTION
 * ===============================
 * Menampilkan 5 video kegiatan desa terbaru:
 * - Tidak menggunakan pagination
 */
exports.getVideoSection = async (req, res) => {
  try {
    const [data] = await db.execute(
      `SELECT id_galeri, judul, lokasi_file, tanggal_upload
       FROM galeri_desa
       WHERE jenis_media = 'Video'
       ORDER BY tanggal_upload DESC
       LIMIT 5`
    );

    res.json({ data });
  } catch (error) {
    console.error('[GET GALERI VIDEO]', error);
    res.status(500).json({ error: 'Gagal mengambil galeri video.' });
  }
};
