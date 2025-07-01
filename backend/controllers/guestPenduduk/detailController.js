const db = require('../../config/db');
const formatTanggalIndonesia = require('../../utils/formatTanggal');

/**
 * ===============================
 * GET DETAIL KONTEN BERITA/PENGUMUMAN
 * ===============================
 * Mengambil detail konten berdasarkan ID konten.
 * Hanya untuk konten kategori 'Berita' atau 'Pengumuman' yang sudah 'Published'.
 *
 * Output JSON sesuai kebutuhan frontend:
 * - id_konten
 * - judul
 * - thumbnail (gambar)
 * - kategori (utama, 'Berita' atau 'Pengumuman')
 * - sub_kategori (nama dari kategori_konten)
 * - tanggal_diperbarui (format: Hari, DD MMMM YYYY - Indonesia)
 * - deskripsi_pendek (ringkasan: max 50 kalimat pertama)
 * - deskripsi_lengkap (konten lengkap)
 */
exports.getDetailKonten = async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil konten dengan status Published dan kategori yang diizinkan
    const [rows] = await db.execute(`
      SELECT 
        id_konten,
        judul,
        thumbnail,
        kategori,
        (
          SELECT nama_kategori 
          FROM kategori_konten 
          WHERE id_kategori = konten.id_sub_kategori
        ) AS sub_kategori_konten,
        diperbarui_pada,
        deskripsi
      FROM konten
      WHERE id_konten = ? AND kategori IN ('Berita', 'Pengumuman') AND status = 'Published'
      LIMIT 1
    `, [id]);

    // Jika tidak ditemukan, kirim error
    if (!rows.length) {
      return res.status(404).json({ error: 'Konten tidak ditemukan atau belum dipublikasikan.' });
    }

    const konten = rows[0];

    // Deskripsi dipastikan string agar aman diproses
    const deskripsiText = konten.deskripsi || '';

    // Pecah jadi array kalimat berdasarkan tanda titik, tanda seru, atau tanda tanya
    const deskripsiKalimat = deskripsiText.split(/[.!?]+/).filter(k => k.trim() !== '');

    // Ambil 50 kalimat pertama, gabungkan kembali sebagai ringkasan
    const deskripsiPendek = deskripsiKalimat.slice(0, 50).join('. ') + (deskripsiKalimat.length > 50 ? '...' : '');

    // Format tanggal ke format lokal (Indonesia)
    const tanggal_diperbarui = formatTanggalIndonesia(konten.diperbarui_pada);

    // Kirim JSON ke frontend
    res.json({
      id_konten: konten.id_konten,
      judul: konten.judul,
      thumbnail: konten.thumbnail,
      kategori: konten.kategori,
      sub_kategori: konten.sub_kategori_konten,
      tanggal_diperbarui,
      deskripsi_pendek: deskripsiPendek,
      deskripsi_lengkap: konten.deskripsi
    });
  } catch (err) {
    console.error('[DETAIL KONTEN]', err);
    res.status(500).json({ error: 'Gagal mengambil detail konten.' });
  }
};
