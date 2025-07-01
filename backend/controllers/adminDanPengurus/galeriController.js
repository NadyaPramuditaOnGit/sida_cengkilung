const db = require('../../config/db');
const fs = require('fs');
const path = require('path');

// Valid kategori dan jenis media sesuai tabel
const validKategori = ['Keagamaan', 'Kesenian', 'Kegiatan'];
const validJenisMedia = ['Foto', 'Video'];

// GET /adminDanPengurus/galeri?jenis_media=Foto&page=1&search=xxx
exports.getGaleri = async (req, res) => {
  const jenis_media = req.query.jenis_media || 'Foto'; // default Foto
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 3; // fix 3 per page
  const offset = (page - 1) * limit;

  if (!validJenisMedia.includes(jenis_media)) {
    return res.status(400).json({ error: 'Jenis media tidak valid.' });
  }

  try {
    const query = `
      SELECT id_galeri, judul, deskripsi, tanggal_upload, kategori, jenis_media, lokasi_file, unggulan, tag, id_konten, diperbarui_pada
      FROM galeri_desa
      WHERE jenis_media = ? AND (judul LIKE ? OR deskripsi LIKE ?)
      ORDER BY diperbarui_pada DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await db.execute(query, [jenis_media, `%${search}%`, `%${search}%`]);

    res.json(rows);
  } catch (err) {
    console.error('[GET GALERI]', err);
    res.status(500).json({ error: 'Gagal mengambil data galeri.' });
  }
};

// GET /adminDanPengurus/galeri/:id
exports.getGaleriById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM galeri_desa WHERE id_galeri = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Galeri tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[GET GALERI BY ID]', err);
    res.status(500).json({ error: 'Gagal mengambil data galeri.' });
  }
};

// POST /adminDanPengurus/galeri (tambah galeri)
exports.createGaleri = async (req, res) => {
  const { judul, deskripsi, tanggal_upload, kategori, jenis_media, unggulan, tag, id_konten } = req.body;
  const files = req.files;

  if (!judul || !kategori || !jenis_media || !id_konten) {
    return res.status(400).json({ error: 'Field judul, kategori, jenis_media, dan id_konten wajib diisi.' });
  }

  if (!validKategori.includes(kategori)) {
    return res.status(400).json({ error: 'Kategori tidak valid.' });
  }

  if (!validJenisMedia.includes(jenis_media)) {
    return res.status(400).json({ error: 'Jenis media tidak valid.' });
  }

  if (isNaN(parseInt(id_konten)) || parseInt(id_konten) <= 0) {
    return res.status(400).json({ error: 'id_konten harus berupa angka lebih dari 0.' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'File media wajib diupload.' });
  }

  // Parsing tag jika ada
  let parsedTag = null;
  if (tag) {
    try {
      parsedTag = JSON.parse(tag);
      if (!Array.isArray(parsedTag)) {
        return res.status(400).json({ error: 'Tag harus berupa array.' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Format tag tidak valid. Gunakan array JSON, contoh: ["budaya", "adat"]' });
    }
  }

  try {
    // Validasi id_konten ada di DB
    const [kontenRows] = await db.execute('SELECT id_konten FROM konten WHERE id_konten = ?', [parseInt(id_konten)]);
    if (!kontenRows.length) {
      return res.status(400).json({ error: 'id_konten tidak ditemukan di tabel konten.' });
    }

    const diunggah_oleh = req.user.id;
    const unggulanVal = unggulan ? 1 : 0;

    const promises = files.map(file => {
      const lokasi_file = `${req.protocol}://${req.get('host')}/uploads/galeri/${file.filename}`;

      const query = `
        INSERT INTO galeri_desa
        (judul, deskripsi, tanggal_upload, kategori, jenis_media, lokasi_file, diunggah_oleh, unggulan, tag, id_konten)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      return db.execute(query, [
        judul,
        deskripsi || null,
        tanggal_upload || null,
        kategori,
        jenis_media,
        lokasi_file,
        diunggah_oleh,
        unggulanVal,
        parsedTag ? JSON.stringify(parsedTag) : null,
        parseInt(id_konten)
      ]);
    });

    await Promise.all(promises);

    res.status(201).json({ message: 'Galeri berhasil dibuat.' });
  } catch (err) {
    console.error('[CREATE GALERI]', err);
    res.status(500).json({ error: 'Gagal membuat galeri.' });
  }
};

// PUT /adminDanPengurus/galeri/:id (update galeri)
exports.updateGaleri = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, tanggal_upload, kategori, jenis_media, unggulan, tag, id_konten } = req.body;
  const files = req.files;

  if (!judul || !kategori || !jenis_media || !id_konten) {
    return res.status(400).json({ error: 'Field judul, kategori, jenis_media, dan id_konten wajib diisi.' });
  }

  if (!validKategori.includes(kategori)) {
    return res.status(400).json({ error: 'Kategori tidak valid.' });
  }

  if (!validJenisMedia.includes(jenis_media)) {
    return res.status(400).json({ error: 'Jenis media tidak valid.' });
  }

  if (isNaN(parseInt(id_konten)) || parseInt(id_konten) <= 0) {
    return res.status(400).json({ error: 'id_konten harus berupa angka lebih dari 0.' });
  }

  // Parsing tag
  let parsedTag = null;
  if (tag) {
    try {
      parsedTag = JSON.parse(tag);
      if (!Array.isArray(parsedTag)) {
        return res.status(400).json({ error: 'Tag harus berupa array.' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Format tag tidak valid. Gunakan array JSON, contoh: ["budaya", "adat"]' });
    }
  }

  try {
    // Validasi id_konten ada di DB
    const [kontenRows] = await db.execute('SELECT id_konten FROM konten WHERE id_konten = ?', [parseInt(id_konten)]);
    if (!kontenRows.length) {
      return res.status(400).json({ error: 'id_konten tidak ditemukan di tabel konten.' });
    }

    // Ambil data lama
    const [oldRows] = await db.execute('SELECT lokasi_file FROM galeri_desa WHERE id_galeri = ?', [id]);
    if (!oldRows.length) return res.status(404).json({ error: 'Galeri tidak ditemukan.' });

    // Hapus file lama jika ada file baru
    if (files && files.length > 0) {
      const oldFilename = path.basename(oldRows[0].lokasi_file);
      const filePath = path.join('uploads/galeri', oldFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const lokasi_file = files && files.length > 0
      ? `${req.protocol}://${req.get('host')}/uploads/galeri/${files[0].filename}`
      : oldRows[0].lokasi_file;

    const unggulanVal = unggulan ? 1 : 0;

    const query = `
      UPDATE galeri_desa
      SET judul = ?, deskripsi = ?, tanggal_upload = ?, kategori = ?, jenis_media = ?, lokasi_file = ?, unggulan = ?, tag = ?, id_konten = ?, diperbarui_pada = NOW()
      WHERE id_galeri = ?
    `;

    await db.execute(query, [
      judul,
      deskripsi || null,
      tanggal_upload || null,
      kategori,
      jenis_media,
      lokasi_file,
      unggulanVal,
      parsedTag ? JSON.stringify(parsedTag) : null,
      parseInt(id_konten),
      id
    ]);

    res.json({ message: 'Galeri berhasil diperbarui.' });
  } catch (err) {
    console.error('[UPDATE GALERI]', err);
    res.status(500).json({ error: 'Gagal update galeri.' });
  }
};

// DELETE /adminDanPengurus/galeri/:id
exports.deleteGaleri = async (req, res) => {
  const { id } = req.params;
  try {
    // Ambil file dulu untuk hapus fisik
    const [rows] = await db.execute('SELECT lokasi_file FROM galeri_desa WHERE id_galeri = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Galeri tidak ditemukan.' });

    const fileUrl = rows[0].lokasi_file;
    const filename = path.basename(fileUrl);
    const filePath = path.join('uploads/galeri', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.execute('DELETE FROM galeri_desa WHERE id_galeri = ?', [id]);

    res.json({ message: 'Galeri berhasil dihapus.' });
  } catch (err) {
    console.error('[DELETE GALERI]', err);
    res.status(500).json({ error: 'Gagal hapus galeri.' });
  }
};
