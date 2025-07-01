const db = require('../../config/db');

exports.searchAll = async (req, res) => {
  const keyword = req.query.keyword || '';
  if (keyword.trim() === '') {
    return res.status(400).json({ error: 'Keyword pencarian wajib diisi.' });
  }

  try {
    const likeKeyword = `%${keyword}%`;

    // Cari di konten
    const [kontenResults] = await db.execute(
      `SELECT 'konten' AS tipe, id_konten AS id, judul, deskripsi 
       FROM konten 
       WHERE judul LIKE ? OR deskripsi LIKE ?`,
      [likeKeyword, likeKeyword]
    );

    // Cari di agenda_desa
    const [agendaResults] = await db.execute(
      `SELECT 'agenda' AS tipe, id_agenda AS id, judul_kegiatan AS judul, deskripsi 
       FROM agenda_desa
       WHERE judul_kegiatan LIKE ? OR deskripsi LIKE ?`,
      [likeKeyword, likeKeyword]
    );

    // Cari di galeri_desa
    const [galeriResults] = await db.execute(
      `SELECT 'galeri' AS tipe, id_galeri AS id, judul, deskripsi
       FROM galeri_desa
       WHERE judul LIKE ? OR deskripsi LIKE ?`,
      [likeKeyword, likeKeyword]
    );

    // Gabungkan hasil, bisa kamu batasi jumlah hasil per tipe kalau mau
    const results = [...kontenResults, ...agendaResults, ...galeriResults];

    res.json({ results });
  } catch (error) {
    console.error('[SEARCH ALL]', error);
    res.status(500).json({ error: 'Gagal melakukan pencarian.' });
  }
};
