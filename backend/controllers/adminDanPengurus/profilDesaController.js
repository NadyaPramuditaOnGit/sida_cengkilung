const db = require('../../config/db');
const path = require('path');
const fs = require('fs');

// Ambil data profil berdasarkan bagian
exports.getProfilByBagian = async (req, res) => {
  const { bagian } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM profil_desa WHERE bagian = ? ORDER BY urutan_tampil ASC',
      [bagian]
    );
    res.json(rows);
  } catch (err) {
    console.error('[GET PROFIL]', err);
    res.status(500).json({ error: 'Gagal mengambil data profil.' });
  }
};

// Ubah deskripsi dan video (konten dan judul)
exports.updateProfil = async (req, res) => {
  const { id } = req.params;
  const { konten, judul } = req.body;

  try {
    await db.execute(
      'UPDATE profil_desa SET konten = ?, judul = ? WHERE id_profil = ?',
      [konten, judul, id]
    );
    res.json({ message: 'Profil desa berhasil diperbarui.' });
  } catch (err) {
    console.error('[UPDATE PROFIL]', err);
    res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
};

// Upload maksimal 15 gambar profil
exports.uploadGambarProfil = async (req, res) => {
  try {
    const paths = req.files.map(file => `/uploads/profil/${file.filename}`);
    res.json({ message: 'Gambar berhasil diunggah.', files: paths });
  } catch (err) {
    console.error('[UPLOAD GAMBAR PROFIL]', err);
    res.status(500).json({ error: 'Gagal mengunggah gambar.' });
  }
};

// Hapus file gambar profil berdasarkan nama file
exports.deleteFotoProfil = async (req, res) => {
  const { filename } = req.params;
  const filepath = path.join(__dirname, '../../uploads/profil/', filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      console.error('[DELETE GAMBAR]', err);
      return res.status(500).json({ error: 'Gagal menghapus gambar.' });
    }
    res.json({ message: 'Gambar berhasil dihapus.' });
  });
};

// Ambil data perangkat desa dengan pagination
exports.getPerangkatDesa = async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
  
    const validPage = Number.isInteger(page) && page > 0 ? page : 1;
    const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const offset = (validPage - 1) * validLimit;
  
    console.log('getPerangkatDesa:', { page: validPage, limit: validLimit, offset });
  
    try {
      // Gunakan template literal untuk langsung menyisipkan angka ke SQL
      const query = `
        SELECT id_profil, judul AS nama, konten AS jabatan, lokasi_gambar 
        FROM profil_desa 
        WHERE bagian = 'PerangkatDesa' 
        ORDER BY urutan_tampil ASC 
        LIMIT ${validLimit} OFFSET ${offset}
      `;
  
      const [rows] = await db.execute(query); // tanpa parameter di sini
      res.json(rows);
    } catch (err) {
      console.error('[GET PERANGKAT DESA]', err);
      res.status(500).json({ error: 'Gagal mengambil perangkat desa.' });
    }
};