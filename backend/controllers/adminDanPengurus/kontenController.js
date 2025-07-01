const db = require('../../config/db');
const slugify = require('../../utils/slugify');
const fs = require('fs');
const path = require('path');
const { basename } = require('path');

const validKategori = ['Berita', 'Pengumuman', 'Sejarah'];

// GET /admin/konten -> list berita/pengumuman dengan pagination & search
exports.getKonten = async (req, res) => {
  const kategori = req.query.kategori || 'Berita';
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  if (!['Berita', 'Pengumuman'].includes(kategori)) {
    return res.status(400).json({ error: 'Kategori tidak valid.' });
  }

  if (isNaN(limit) || isNaN(offset)) {
    return res.status(400).json({ error: 'Parameter pagination tidak valid.' });
  }

  try {
    console.log('[DEBUG]', { kategori, search: `%${search}%`, limit, offset });

    // GUNAKAN string literal untuk LIMIT & OFFSET
    const query = `
      SELECT id_konten, judul, tanggal_publish, deskripsi, kategori, thumbnail, status, diperbarui_pada
      FROM konten
      WHERE kategori = ? AND judul LIKE ?
      ORDER BY diperbarui_pada DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await db.execute(query, [kategori, `%${search}%`]);

    res.json(rows);
  } catch (error) {
    console.error('[GET KONTEN]', error);
    res.status(500).json({ error: 'Gagal mengambil data konten.' });
  }
};


// GET /admin/konten/:id
exports.getKontenById = async (req,res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM konten WHERE id_konten = ?', [id]);
    if (!rows.length) return res.status(404).json({error:'Konten tidak ditemukan.'});
    res.json(rows[0]);
  } catch(err){console.error;res.status(500).json({error:'Gagal ambil konten.'});}
};

// POST /admin/konten
exports.createKonten = async (req,res) => {
  const { judul, tanggal_publish, kategori, deskripsi, status } = req.body;
  const thumbnail = req.file
  ? `${req.protocol}://${req.get('host')}/uploads/thumbnails/${req.file.filename}`
  : null;

  if (!judul||!tanggal_publish||!kategori||!deskripsi||!status)
    return res.status(400).json({error:'Field wajib diisi.'});
  if (!validKategori.includes(kategori)) return res.status(400).json({error:'Kategori tidak valid.'});
  if (!['Draft','Published','Archived'].includes(status))
    return res.status(400).json({error:'Status tidak valid.'});

  const slug = slugify(judul, { lower: true });
  const penulis = req.user.id;

  try {
    const query = `
      INSERT INTO konten(judul,slug,deskripsi,tanggal_publish,kategori,id_penulis,thumbnail,status)
      VALUES(?,?,?,?,?,?,?,?)
    `;
    await db.execute(query,[judul,slug,deskripsi,tanggal_publish,kategori,penulis,thumbnail,status]);
    res.status(201).json({message:'Konten berhasil dibuat.'});
  } catch(err){
    console.error('[CREATE KONTEN]',err);
    res.status(500).json({error:'Gagal membuat konten.'});
  }
};

// PUT /admin/konten/:id
exports.updateKonten = async (req,res) => {
  const {id} = req.params;
  const { judul, tanggal_publish, kategori, deskripsi, status } = req.body;
  const thumbnail = req.file
  ? `${req.protocol}://${req.get('host')}/uploads/thumbnails/${req.file.filename}`
  : null;

  if (!judul||!tanggal_publish||!kategori||!deskripsi||!status)
    return res.status(400).json({error:'Field wajib diisi.'});
  if (!validKategori.includes(kategori)) return res.status(400).json({error:'Kategori tidak valid.'});
  if (!['Draft','Published','Archived'].includes(status))
    return res.status(400).json({error:'Status tidak valid.'});

  try {
    const [old] = await db.execute('SELECT thumbnail FROM konten WHERE id_konten=?', [id]);
    if (!old.length) return res.status(404).json({error:'Konten tidak ditemukan.'});
    if (thumbnail && old[0].thumbnail) fs.unlinkSync(path.join('uploads/thumbnails', old[0].thumbnail));

    const slug = slugify(judul, { lower: true });
    const query = `
      UPDATE konten SET judul=?, slug=?, deskripsi=?, tanggal_publish=?, kategori=?, thumbnail=?, status=?, diperbarui_pada=NOW()
      WHERE id_konten=?
    `;
    await db.execute(query,[judul,slug,deskripsi,tanggal_publish,kategori, thumbnail || old[0].thumbnail, status, id]);
    res.json({message:'Konten berhasil diperbarui.'});
  } catch(err){
    console.error('[UPDATE KONTEN]',err);
    res.status(500).json({error:'Gagal update konten.'});
  }
};

// DELETE /admin/konten/:id
exports.deleteKonten = async (req,res) => {
  const {id} = req.params;
  try {
    // Ambil data thumbnail dulu
    const [old] = await db.execute('SELECT thumbnail FROM konten WHERE id_konten=?',[id]);
    if (!old.length) return res.status(404).json({error:'Konten tidak ditemukan.'});

    // Hapus file thumbnail jika ada
    if (old[0].thumbnail) {
      const fileName = path.basename(old[0].thumbnail);
      const filePath = path.join('uploads/thumbnails', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Hapus dulu data galeri_desa yang terkait dengan id_konten
    await db.execute('DELETE FROM galeri_desa WHERE id_konten=?', [id]);

    // Baru hapus konten
    await db.execute('DELETE FROM konten WHERE id_konten=?',[id]);

    res.json({message:'Konten berhasil dihapus.'});
  } catch(err){
    console.error('[DELETE KONTEN]',err);
    res.status(500).json({error:'Gagal hapus konten.'});
  }
};
