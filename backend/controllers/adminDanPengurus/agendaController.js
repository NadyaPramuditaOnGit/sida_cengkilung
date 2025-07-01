const db = require('../../config/db');
const path = require('path');
const moment = require('moment');
moment.locale('id');


// Ambil daftar agenda dengan pagination dan optional filter bulan
// exports.getAgendaList = async (req, res) => {
//   const { bulan = new Date().getMonth() + 1, tahun = new Date().getFullYear(), page = 1, limit = 5 } = req.query;
//   const offset = (parseInt(page) - 1) * parseInt(limit);

//   try {
//     const [rows] = await db.execute(`
//       SELECT id_agenda, judul_kegiatan, lokasi, deskripsi, tanggal, waktu, jenis_kegiatan, gambar
//       FROM agenda_desa
//       WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?
//       ORDER BY tanggal DESC
//       LIMIT ? OFFSET ?
//     `, [bulan, tahun, parseInt(limit), offset]);

//     res.json(rows);
//   } catch (error) {
//     console.error('[GET AGENDA LIST]', error);
//     res.status(500).json({ error: 'Gagal mengambil daftar agenda.' });
//   }
// };

exports.getAgendaList = async (req, res) => {
  const { bulan = new Date().getMonth() + 1, tahun = new Date().getFullYear(), page = 1, limit = 5 } = req.query;
  const limitInt = parseInt(limit);
  const offset = (parseInt(page) - 1) * limitInt;

  try {
    const query = `
      SELECT id_agenda, judul_kegiatan, lokasi, deskripsi, tanggal, waktu, jenis_kegiatan, gambar
      FROM agenda_desa
      WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?
      ORDER BY tanggal DESC
      LIMIT ${limitInt} OFFSET ${offset}
    `;

    const [rows] = await db.execute(query, [bulan, tahun]);

    const hasil = rows.map(item => {
      const deskripsi = item.deskripsi?.trim() || '';
      const kalimat = deskripsi.split('. ').slice(0, 5).join('. ').trim();

      // Pastikan tidak double titik di akhir
      const deskripsi_singkat = kalimat.endsWith('.') ? kalimat + '...' : kalimat + '...';

      return {
        ...item,
        tanggal_format: moment(item.tanggal).format('dddd, D MMMM YYYY'),
        deskripsi_singkat
      };
    });

    res.json(hasil);
  } catch (error) {
    console.error('[ADMIN AGENDA LIST]', error);
    res.status(500).json({ error: 'Gagal mengambil daftar agenda admin.' });
  }
};


  

// Ambil semua tanggal yang memiliki agenda (untuk ditandai di kalender)
exports.getKalenderAgenda = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT tanggal
      FROM agenda_desa
      GROUP BY tanggal
      ORDER BY tanggal ASC
    `);
    res.json(rows.map(r => r.tanggal));
  } catch (error) {
    console.error('[GET KALENDER AGENDA]', error);
    res.status(500).json({ error: 'Gagal mengambil data kalender.' });
  }
};

// Ambil agenda berdasarkan ID
exports.getAgendaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(`SELECT * FROM agenda_desa WHERE id_agenda = ?`, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Agenda tidak ditemukan.' });
    res.json(rows[0]);
  } catch (error) {
    console.error('[GET AGENDA BY ID]', error);
    res.status(500).json({ error: 'Gagal mengambil agenda.' });
  }
};

// Tambah agenda
exports.createAgenda = async (req, res) => {
  const { judul_kegiatan, tanggal, waktu, lokasi, deskripsi, jenis_kegiatan, id_konten } = req.body;
  const gambar = req.file ? `/uploads/agenda/${req.file.filename}` : null;
  const dibuat_oleh = req.user.id;
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
 
  if (req.file && !allowedExtensions.includes(path.extname(req.file.originalname).toLowerCase())) {
    return res.status(400).json({ error: 'Format file tidak diperbolehkan.' });
  }

  if (!judul_kegiatan || !tanggal || !lokasi || !jenis_kegiatan) {
    return res.status(400).json({ error: 'Data wajib tidak lengkap.' });
  }

  try {
    await db.execute(`
      INSERT INTO agenda_desa (judul_kegiatan, tanggal, waktu, lokasi, deskripsi, jenis_kegiatan, id_konten, dibuat_oleh, gambar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [judul_kegiatan, tanggal, waktu || null, lokasi, deskripsi, jenis_kegiatan, id_konten || null, dibuat_oleh, gambar]
    );

    res.status(201).json({ message: 'Agenda berhasil ditambahkan.' });
  } catch (error) {
    console.error('[CREATE AGENDA]', error);
    res.status(500).json({ error: 'Gagal menambahkan agenda.' });
  }
};

// Update agenda
exports.updateAgenda = async (req, res) => {
  const { id } = req.params;
  const { judul_kegiatan, tanggal, waktu, lokasi, deskripsi, jenis_kegiatan, id_konten } = req.body;
  const gambar = req.file ? `/uploads/agenda/${req.file.filename}` : null;

  try {
    const [cek] = await db.execute(`SELECT * FROM agenda_desa WHERE id_agenda = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Agenda tidak ditemukan.' });

    await db.execute(`
      UPDATE agenda_desa SET
        judul_kegiatan = ?, tanggal = ?, waktu = ?, lokasi = ?, deskripsi = ?, jenis_kegiatan = ?,
        id_konten = ?, gambar = IFNULL(?, gambar), diperbarui_pada = NOW()
      WHERE id_agenda = ?`,
      [judul_kegiatan, tanggal, waktu || null, lokasi, deskripsi, jenis_kegiatan, id_konten || null, gambar, id]
    );

    res.json({ message: 'Agenda berhasil diperbarui.' });
  } catch (error) {
    console.error('[UPDATE AGENDA]', error);
    res.status(500).json({ error: 'Gagal memperbarui agenda.' });
  }
};

// Hapus agenda
exports.deleteAgenda = async (req, res) => {
  const { id } = req.params;
  try {
    const [cek] = await db.execute(`SELECT 1 FROM agenda_desa WHERE id_agenda = ?`, [id]);
    if (cek.length === 0) return res.status(404).json({ error: 'Agenda tidak ditemukan.' });

    await db.execute(`DELETE FROM agenda_desa WHERE id_agenda = ?`, [id]);
    res.json({ message: 'Agenda berhasil dihapus.' });
  } catch (error) {
    console.error('[DELETE AGENDA]', error);
    res.status(500).json({ error: 'Gagal menghapus agenda.' });
  }
};
