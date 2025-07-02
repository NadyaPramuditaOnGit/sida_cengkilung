// controllers/agendaController.js

const db = require('../../config/db');

// Dapatkan semua tanggal di bulan tertentu yang memiliki agenda
exports.getAgendaDatesByMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    const [rows] = await db.execute(
      `SELECT tanggal, jenis_kegiatan
       FROM agenda_desa
       WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ?
       ORDER BY tanggal ASC`,
      [year, month]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('[getAgendaDatesByMonth] ❌', err.message);
    return res.status(500).json({ error: 'Gagal mengambil data agenda bulanan' });
  }
};

// Dapatkan detail agenda untuk tanggal tertentu
exports.getAgendaByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const [rows] = await db.execute(
      `SELECT id_agenda, judul_kegiatan, tanggal, waktu, lokasi, deskripsi, jenis_kegiatan
       FROM agenda_desa
       WHERE tanggal = ?`,
      [date]
    );

    return res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('[getAgendaByDate] ❌', err.message);
    return res.status(500).json({ error: 'Gagal mengambil agenda pada tanggal tersebut' });
  }
};
