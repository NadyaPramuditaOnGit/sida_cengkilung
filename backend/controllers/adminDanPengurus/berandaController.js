const db = require('../../config/db');

// Bagian-bagian valid untuk konten statis beranda
const bagianValid = [
  'Hero Banner', 'Berita Terkini', 'Video Kegiatan',
  'Sejarah Singkat', 'Statistik Desa'
];

// ==================== CRUD KONTEN BERANDA (Konten Statis) ====================

// GET semua konten beranda
exports.getAllBeranda = async (req, res) => {
  try {
    const [rows] = await db.execute(`SELECT * FROM beranda ORDER BY urutan_tampil ASC`);
    res.json(rows);
  } catch (error) {
    console.error('[GET BERANDA]', error);
    res.status(500).json({ error: 'Gagal mengambil data beranda.' });
  }
};

// GET konten beranda berdasarkan ID
exports.getBerandaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(`SELECT * FROM beranda WHERE id = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Konten beranda tidak ditemukan.' });
    res.json(rows[0]);
  } catch (error) {
    console.error('[GET BY ID]', error);
    res.status(500).json({ error: 'Gagal mengambil detail konten beranda.' });
  }
};

// POST tambah konten beranda
exports.createBeranda = async (req, res) => {
  const {
    bagian, judul, konten, lokasi_gambar,
    url_video, teks_tombol, tautan_tombol,
    urutan_tampil, aktif
  } = req.body;

  // Validasi input
  if (!bagian) return res.status(400).json({ error: 'Bagian beranda wajib diisi.' });
  if (!bagianValid.includes(bagian)) return res.status(400).json({ error: 'Bagian tidak valid.' });
  if (url_video && !/^https?:\/\/.+/.test(url_video)) return res.status(400).json({ error: 'URL video tidak valid.' });
  if (urutan_tampil !== undefined && isNaN(urutan_tampil)) return res.status(400).json({ error: 'Urutan tampil harus berupa angka.' });

  try {
    await db.execute(`
      INSERT INTO beranda (
        bagian, judul, konten, lokasi_gambar,
        url_video, teks_tombol, tautan_tombol,
        urutan_tampil, aktif
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bagian, judul || null, konten || null, lokasi_gambar || null,
        url_video || null, teks_tombol || null, tautan_tombol || null,
        urutan_tampil || 0, aktif !== undefined ? aktif : 1
      ]
    );
    res.status(201).json({ message: 'Konten beranda berhasil ditambahkan.' });
  } catch (error) {
    console.error('[CREATE BERANDA]', error);
    res.status(500).json({ error: 'Gagal menambahkan konten beranda.' });
  }
};

// PUT update konten beranda
exports.updateBeranda = async (req, res) => {
  const { id } = req.params;
  const {
    bagian, judul, konten, lokasi_gambar,
    url_video, teks_tombol, tautan_tombol,
    urutan_tampil, aktif
  } = req.body;

  // Validasi input
  if (!bagianValid.includes(bagian)) return res.status(400).json({ error: 'Bagian tidak valid.' });
  if (url_video && !/^https?:\/\/.+/.test(url_video)) return res.status(400).json({ error: 'URL video tidak valid.' });
  if (urutan_tampil !== undefined && isNaN(urutan_tampil)) return res.status(400).json({ error: 'Urutan tampil harus berupa angka.' });

  try {
    const [cek] = await db.execute(`SELECT id FROM beranda WHERE id = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Konten tidak ditemukan.' });

    await db.execute(`
      UPDATE beranda SET 
        bagian = ?, judul = ?, konten = ?, lokasi_gambar = ?, url_video = ?, 
        teks_tombol = ?, tautan_tombol = ?, urutan_tampil = ?, aktif = ?
      WHERE id = ?`,
      [
        bagian, judul || null, konten || null, lokasi_gambar || null,
        url_video || null, teks_tombol || null, tautan_tombol || null,
        urutan_tampil || 0, aktif !== undefined ? aktif : 1,
        id
      ]
    );

    res.json({ message: 'Konten beranda berhasil diperbarui.' });
  } catch (error) {
    console.error('[UPDATE BERANDA]', error);
    res.status(500).json({ error: 'Gagal memperbarui konten beranda.' });
  }
};

// DELETE konten beranda
exports.deleteBeranda = async (req, res) => {
  const { id } = req.params;

  try {
    const [cek] = await db.execute(`SELECT id FROM beranda WHERE id = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Konten tidak ditemukan.' });

    await db.execute(`DELETE FROM beranda WHERE id = ?`, [id]);
    res.json({ message: 'Konten beranda berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE BERANDA]', error);
    res.status(500).json({ error: 'Gagal menghapus konten beranda.' });
  }
};

// ==================== DATA UNTUK HALAMAN DASHBOARD PENGURUS ====================

// Statistik ringkasan dashboard
exports.getStatistikBulanIni = async (req, res) => {
  try {
    const [berita] = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM konten 
      WHERE MONTH(diperbarui_pada) = MONTH(CURRENT_DATE())
        AND YEAR(diperbarui_pada) = YEAR(CURRENT_DATE())
    `);

    const [galeri] = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM galeri_desa 
      WHERE MONTH(tanggal_upload) = MONTH(CURRENT_DATE())
        AND YEAR(tanggal_upload) = YEAR(CURRENT_DATE())
    `);

    const [login] = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM log_aktivitas 
      WHERE jenis_log = 'Login Pengguna'
        AND MONTH(dibuat_pada) = MONTH(CURRENT_DATE())
        AND YEAR(dibuat_pada) = YEAR(CURRENT_DATE())
    `);

    const [agenda] = await db.execute(`
      SELECT COUNT(*) AS total 
      FROM agenda_desa 
      WHERE tanggal >= CURDATE()
    `);

    res.json({
      jumlah_berita: berita[0].total,
      jumlah_galeri: galeri[0].total,
      jumlah_login: login[0].total,
      jumlah_agenda_mendatang: agenda[0].total
    });
  } catch (error) {
    console.error('[STATISTIK BULAN INI]', error);
    res.status(500).json({ error: 'Gagal mengambil statistik.' });
  }
};

// Berita & pengumuman terbaru (limit 5)
exports.getBeritaPengumumanTerkini = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        k.id_konten, k.judul, k.thumbnail,
        CONCAT(SUBSTRING_INDEX(k.deskripsi, ' ', 12), '...') AS deskripsi_singkat,
        DATE_FORMAT(k.diperbarui_pada, '%d %M %Y') AS tanggal
      FROM konten k
      WHERE k.kategori IN ('Berita', 'Pengumuman')
      ORDER BY k.diperbarui_pada DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET BERITA/PENGUMUMAN]', error);
    res.status(500).json({ error: 'Gagal mengambil data berita/pengumuman.' });
  }
};

// Agenda desa mendatang (limit 3)
exports.getAgendaTerkini = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id_agenda, judul_kegiatan, tanggal, lokasi
      FROM agenda_desa
      WHERE tanggal >= CURDATE()
      ORDER BY tanggal ASC, waktu ASC
      LIMIT 3
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET AGENDA TERKINI]', error);
    res.status(500).json({ error: 'Gagal mengambil agenda terkini.' });
  }
};

// Galeri foto terbaru (limit 10)
exports.getGaleriTerkini = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id_galeri, judul, deskripsi, lokasi_file, jenis_media, 
        DATE_FORMAT(dibuat_pada, '%Y-%m-%d') AS tanggal
      FROM galeri_desa
      WHERE jenis_media = 'Foto'
      ORDER BY dibuat_pada DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET GALERI TERKINI]', error);
    res.status(500).json({ error: 'Gagal mengambil galeri terkini.' });
  }
};

// Data statistik desa tahun berjalan
exports.getDataDesaStatistik = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        jenis_data, jumlah_laki, jumlah_perempuan, 
        (jumlah_laki + jumlah_perempuan) AS total
      FROM data_desa
      WHERE tahun = YEAR(CURRENT_DATE())
      ORDER BY FIELD(
        jenis_data,
        'Jumlah Penduduk', 'Agama', 'Pekerjaan', 'Pendidikan', 'Usia', 'Status Perkawinan'
      )
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET DATA DESA]', error);
    res.status(500).json({ error: 'Gagal mengambil data desa.' });
  }
};

// === Endpoint utama untuk frontend dashboard pengurus ===
exports.getBeranda = async (req, res) => {
  try {
    // Statistik ringkasan
    const [berita] = await db.execute(`
      SELECT COUNT(*) AS total FROM konten 
      WHERE MONTH(diperbarui_pada) = MONTH(CURRENT_DATE())
        AND YEAR(diperbarui_pada) = YEAR(CURRENT_DATE())
    `);
    const [galeri] = await db.execute(`
      SELECT COUNT(*) AS total FROM galeri_desa 
      WHERE MONTH(tanggal_upload) = MONTH(CURRENT_DATE())
        AND YEAR(tanggal_upload) = YEAR(CURRENT_DATE())
    `);
    const [login] = await db.execute(`
      SELECT COUNT(*) AS total FROM log_aktivitas 
      WHERE jenis_log = 'Login Pengguna'
        AND MONTH(dibuat_pada) = MONTH(CURRENT_DATE())
        AND YEAR(dibuat_pada) = YEAR(CURRENT_DATE())
    `);
    const [agenda] = await db.execute(`
      SELECT COUNT(*) AS total FROM agenda_desa 
      WHERE tanggal >= CURDATE()
    `);

    // Berita & pengumuman terbaru
    const [beritaTerkini] = await db.execute(`
      SELECT 
        k.id_konten, k.judul, k.thumbnail,
        CONCAT(SUBSTRING_INDEX(k.deskripsi, ' ', 12), '...') AS deskripsi_singkat,
        DATE_FORMAT(k.diperbarui_pada, '%d %M %Y') AS tanggal
      FROM konten k
      WHERE k.kategori IN ('Berita', 'Pengumuman')
      ORDER BY k.diperbarui_pada DESC
      LIMIT 5
    `);

    // Agenda mendatang
    const [agendaTerkini] = await db.execute(`
      SELECT id_agenda, judul_kegiatan, tanggal, lokasi
      FROM agenda_desa
      WHERE tanggal >= CURDATE()
      ORDER BY tanggal ASC, waktu ASC
      LIMIT 3
    `);

    // Galeri terbaru
    const [galeriTerkini] = await db.execute(`
      SELECT id_galeri, judul, deskripsi, lokasi_file, jenis_media, 
             DATE_FORMAT(dibuat_pada, '%Y-%m-%d') AS tanggal
      FROM galeri_desa
      WHERE jenis_media = 'Foto'
      ORDER BY dibuat_pada DESC
      LIMIT 10
    `);

    // Statistik data desa
    const [dataDesaStatistik] = await db.execute(`
      SELECT 
        jenis_data, jumlah_laki, jumlah_perempuan, 
        (jumlah_laki + jumlah_perempuan) AS total
      FROM data_desa
      WHERE tahun = YEAR(CURRENT_DATE())
      ORDER BY FIELD(
        jenis_data,
        'Jumlah Penduduk', 'Agama', 'Pekerjaan', 'Pendidikan', 'Usia', 'Status Perkawinan'
      )
    `);

    // Kirim semua data dalam satu objek JSON
    res.json({
      statistik: {
        jumlah_berita: berita[0].total,
        jumlah_galeri: galeri[0].total,
        jumlah_login: login[0].total,
        jumlah_agenda_mendatang: agenda[0].total
      },
      beritaTerkini,
      agendaTerkini,
      galeriTerkini,
      dataDesaStatistik
    });
  } catch (error) {
    console.error('[GET BERANDA]', error);
    res.status(500).json({ error: 'Gagal mengambil data beranda.' });
  }
};
