const db = require('../../config/db');

/**
 * Mengambil informasi pengguna untuk ditampilkan di header.
 * - Jika user belum login (guest), kembalikan flag guest: true
 * - Jika login, tampilkan nama lengkap dan peran pengguna
 */
exports.getHeaderInfo = async (req, res) => {
  if (!req.user) {
    // Jika user belum login, tandai sebagai guest
    return res.json({ guest: true });
  }

  try {
    // Ambil data nama lengkap dan peran dari pengguna yang login
    const [rows] = await db.execute(
      `SELECT p.nama_lengkap, r.nama_peran 
       FROM pengguna p
       JOIN peran_pengguna pp ON p.id_pengguna = pp.id_pengguna
       JOIN peran r ON pp.id_peran = r.id
       WHERE p.id_pengguna = ?`,
      [req.user.id]
    );

    // Jika tidak ditemukan, kembalikan error
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    // Format data pengguna
    const user = {
      nama: rows[0].nama_lengkap,
      peran: rows[0].nama_peran,
    };

    // Kirimkan data user dan status guest
    res.json({ guest: false, user });
  } catch (error) {
    console.error('[GET HEADER INFO]', error);
    res.status(500).json({ error: 'Gagal mengambil data header.' });
  }
};
