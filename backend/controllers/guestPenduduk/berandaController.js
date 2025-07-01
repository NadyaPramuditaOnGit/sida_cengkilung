const db = require('../../config/db');

exports.getBeranda = async (req, res) => {
  try {
    // ================= SECTION 1: Hero Banner =================
    const [heroBanner] = await db.execute(
      `SELECT * FROM beranda 
       WHERE bagian = 'Hero Banner' AND aktif = 1 
       ORDER BY urutan_tampil ASC 
       LIMIT 1`
    );

    // ================= SECTION 2: Slider Berita Terkini =================
    const [beritaTerkini] = await db.execute(
      `SELECT id_konten, judul, thumbnail
       FROM konten
       WHERE kategori = 'Berita' AND status = 'Published'
       ORDER BY tanggal_publish DESC
       LIMIT 5`
    );

    // ================= SECTION 3: Sejarah =================
    const [sejarah] = await db.execute(
      `SELECT id_konten, judul, thumbnail, deskripsi
       FROM konten
       WHERE kategori = 'Sejarah' AND status = 'Published'
       ORDER BY tanggal_publish DESC
       LIMIT 1`
    );

    // ================= Ambil bulan dan tahun dari query params =================
    const currentMonth = req.query.bulan ? parseInt(req.query.bulan) : (new Date().getMonth() + 1);
    const currentYear = req.query.tahun ? parseInt(req.query.tahun) : (new Date().getFullYear());

    // ================= SECTION 4 (HANYA UNTUK PENDUDUK) =================
    let agendaDesa = null;
    if (req.user && req.user.id_peran === 3) {
      // Data untuk card agenda (kiri)
      const [agendaCards] = await db.execute(
        `SELECT id_agenda, judul_kegiatan, tanggal, lokasi, gambar
         FROM agenda_desa
         WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?
         ORDER BY tanggal ASC`,
        [currentMonth, currentYear]
      );

      // Data untuk kalender agenda (kanan)
      const [agendaKalender] = await db.execute(
        `SELECT id_agenda, judul_kegiatan, tanggal
         FROM agenda_desa
         WHERE YEAR(tanggal) = ?`,
        [currentYear]
      );

      agendaDesa = { agendaCards, agendaKalender };
    }

    // ================= SECTION 5: Video Kegiatan (untuk semua user) =================
    const [videoKegiatan] = await db.execute(
      `SELECT id_galeri, judul, lokasi_file
       FROM galeri_desa
       WHERE jenis_media = 'Video'
       ORDER BY tanggal_upload DESC
       LIMIT 5`
    );

    // ================= Informasi Pengguna untuk Header (jika login) =================
    let userInfo = null;
    if (req.user) {
      const [userRows] = await db.execute(
        `SELECT p.nama_lengkap, r.nama_peran 
         FROM pengguna p
         JOIN peran_pengguna pp ON p.id_pengguna = pp.id_pengguna
         JOIN peran r ON pp.id_peran = r.id
         WHERE p.id_pengguna = ? AND pp.id_peran = ?`,
        [req.user.id, req.user.id_peran]
      );

      if (userRows.length > 0) {
        userInfo = {
          nama: userRows[0].nama_lengkap,
          peran: userRows[0].nama_peran,
        };
      }
    }

    // ================= Kirim semua data ke frontend =================
    res.json({
      heroBanner: heroBanner[0] || null,
      beritaTerkini,
      sejarah: sejarah[0] || null,
      agendaDesa, // hanya ada jika user Penduduk
      videoKegiatan,
      user: userInfo, // null jika belum login
    });

  } catch (error) {
    console.error('[GET BERANDA]', error);
    res.status(500).json({ error: 'Gagal mengambil data beranda.' });
  }
};