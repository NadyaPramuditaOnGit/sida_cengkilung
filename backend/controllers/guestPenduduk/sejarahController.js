const db = require('../../config/db');
const formatTanggal = require('../../utils/formatTanggal');

// Ambil 3 sejarah terbaru dari konten
exports.getSejarahTerbaru = async (req, res) => {
    try {
    const [rows] = await db.execute(
        `SELECT id_konten, judul, deskripsi, thumbnail, diperbarui_pada
            FROM konten
            WHERE kategori = 'Sejarah' AND status = 'Published'
            ORDER BY diperbarui_pada DESC
            LIMIT 3`
    );

    const hasil = rows.map(row => ({
        id_konten: row.id_konten,
        judul: row.judul,
        deskripsi: row.deskripsi,
        thumbnail: row.thumbnail,
        diperbarui_pada: formatTanggal(row.diperbarui_pada),
    }));

    res.json({ data: hasil });
    } catch (err) {
        console.error('[GET SEJARAH]', err);
        res.status(500).json({ error: 'Gagal mengambil data sejarah.' });
    }
};

exports.getDokumentasiSejarah = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT id_konten, thumbnail, judul
                FROM konten
                WHERE kategori = 'Sejarah' AND status = 'Published' AND thumbnail IS NOT NULL
                ORDER BY diperbarui_pada DESC`
        );

        const hasil = rows.map(row => ({
            id_konten: row.id_konten,
            thumbnail: row.thumbnail,
            judul: row.judul,
        }));

        res.json({ data: hasil });
    } catch (err) {
        console.error('[GET DOKUMENTASI SEJARAH]', err);
        res.status(500).json({ error: 'Gagal mengambil dokumentasi sejarah.' });
    }
};
  