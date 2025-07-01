const db = require('../../config/db');

/**
 * ===========================
 * GAMBARAN UMUM DESA ADAT
 * ===========================
 * Fungsi untuk mengambil konten bagian "Gambaran Umum" atau "Sejarah"
 * dari tabel `profil_desa`, berdasarkan kebutuhan frontend.
 * Diasumsikan field `konten` berisi HTML yang sudah mengandung:
 * - deskripsi teks
 * - video (embed)
 * - dan gambar (jika ada)
 * 
 * Frontend akan menampilkan konten ini sebagai deskripsi lengkap
 * beserta tampilan video dan gambar.
 */
exports.getGambaranUmum = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id_profil, judul, konten, lokasi_gambar 
       FROM profil_desa 
       WHERE bagian = 'Sejarah'
       ORDER BY urutan_tampil ASC`
    );

    // Kirim seluruh hasil sebagai array ke frontend
    res.json({ data: rows });
  } catch (err) {
    console.error('[GET GAMBARAN UMUM]', err);
    res.status(500).json({ error: 'Gagal mengambil gambaran umum desa.' });
  }
};

/**
 * ===========================
 * PERANGKAT DESA
 * ===========================
 * Fungsi untuk mengambil daftar perangkat desa dari tabel `perangkat_desa`.
 * Ditampilkan di frontend dalam bentuk slider.
 * 
 * Data yang dikembalikan:
 * - nama perangkat
 * - jabatan
 * - foto (lokasi gambar)
 */
exports.getPerangkatDesa = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id_perangkat, nama, jabatan, lokasi_foto 
       FROM perangkat_desa 
       ORDER BY urutan_tampil ASC`
    );

    // Kirim data sebagai array untuk frontend render slider
    res.json({ data: rows });
  } catch (err) {
    console.error('[GET PERANGKAT DESA]', err);
    res.status(500).json({ error: 'Gagal mengambil data perangkat desa.' });
  }
};
