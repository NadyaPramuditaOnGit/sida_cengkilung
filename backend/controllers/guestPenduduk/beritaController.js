const db = require('../../config/db');
const formatTanggal = require('../../utils/formatTanggal');

/**
 * Mengambil daftar berita desa untuk ditampilkan di halaman Berita.
 * - Digunakan oleh Guest dan Penduduk
 * - Pagination: 4 berita per halaman
 * - Format: judul, deskripsi (12 kalimat), thumbnail, tanggal diperbarui
 */
exports.getDaftarBerita = async (req, res) => {
  // Ambil parameter page dari query, default ke 1 jika tidak ada
  const page = parseInt(req.query.page) || 1;
  const limit = 4; // 4 berita per halaman
  const offset = (page - 1) * limit;

  try {
    // Ambil berita dari database berdasarkan kategori = Berita dan status = Published
    const [rows] = await db.execute(
      `SELECT id_konten, judul, deskripsi, thumbnail, diperbarui_pada
       FROM konten
       WHERE kategori = 'Berita' AND status = 'Published'
       ORDER BY diperbarui_pada DESC
       LIMIT ${limit} OFFSET ${offset}`
    );

    // Format hasil: potong deskripsi jadi 12 kalimat pertama
    const data = rows.map((berita) => {
      // Pisahkan kalimat berdasarkan tanda titik, seru, atau tanya
      const kalimat = berita.deskripsi
        .split(/[.!?]+/)
        .slice(0, 12)
        .join('. ') + '...';

      return {
        id_konten: berita.id_konten,
        judul: berita.judul,
        thumbnail: berita.thumbnail,
        deskripsi: kalimat,
        diperbarui_pada: formatTanggal(berita.diperbarui_pada),
      };
    });

    // Kirimkan data ke frontend
    res.json({ page, limit, data });
  } catch (err) {
    console.error('[GET DAFTAR BERITA]', err);
    res.status(500).json({ error: 'Gagal mengambil daftar berita.' });
  }
};
