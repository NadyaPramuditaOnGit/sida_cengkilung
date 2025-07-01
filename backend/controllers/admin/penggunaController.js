const db = require('../../config/db');
const bcrypt = require('bcrypt');
const validator = require('validator');
const path = require('path');
const fs = require('fs');


const validStatus = ['Aktif', 'Non-Aktif'];

/**
 * GET /admin/pengguna
 * Ambil semua pengguna dengan pagination.
 */
exports.getAllPengguna = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  if (Array.isArray(page) || Array.isArray(limit)) {
    return res.status(400).json({ error: 'Query param tidak boleh array.' });
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;

  if (!Number.isInteger(limitNumber) || !Number.isInteger(offset)) {
    return res.status(400).json({ error: 'Limit dan offset harus bilangan bulat.' });
  }

  console.log('[DEBUG]', { page: pageNumber, limit: limitNumber, offset });

  try {
    const query = `
      SELECT id_pengguna, nama_lengkap, nik, tanggal_lahir, email, no_hp,
             nama_pengguna, status, jabatan, alamat
      FROM pengguna
      ORDER BY id_pengguna DESC
      LIMIT ${limitNumber} OFFSET ${offset}
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (err) {
    console.error('[GET ALL PENGGUNA]', err);
    res.status(500).json({ error: 'Gagal mengambil data pengguna.' });
  }
};

/**
 * GET /admin/pengguna/:id
 * Ambil detail satu pengguna.
 */
exports.getPenggunaById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT id_pengguna, nama_lengkap, nik, tanggal_lahir, email,
              no_hp, nama_pengguna, status, jabatan, alamat
       FROM pengguna WHERE id_pengguna = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[GET PENGGUNA BY ID]', err);
    res.status(500).json({ error: 'Gagal mengambil pengguna.' });
  }
};

/**
 * Tambah pengguna baru oleh admin
 */
// exports.tambahPenggunaManual = async (req, res) => {
//   const {
//     nik, namaLengkap, tanggalLahir, email, noHp,
//     namaPengguna, kataSandi, ulangKataSandi,
//     status, jabatan, alamat, idPeran
//   } = req.body;

//   if (!nik || !namaLengkap || !tanggalLahir || !namaPengguna || !kataSandi || !ulangKataSandi || !status || !idPeran) {
//     return res.status(400).json({ error: 'Semua field wajib diisi.' });
//   }

//   if (!validStatus.includes(status)) {
//     return res.status(400).json({ error: 'Status harus "Aktif" atau "Non-Aktif".' });
//   }

//   if (kataSandi !== ulangKataSandi) {
//     return res.status(400).json({ error: 'Password dan ulangi password tidak sama.' });
//   }

//   if (!validator.isLength(kataSandi, { min: 6 })) {
//     return res.status(400).json({ error: 'Password minimal 6 karakter.' });
//   }

//   if (!validator.isLength(nik, { min: 16, max: 16 })) {
//     return res.status(400).json({ error: 'NIK harus 16 digit.' });
//   }

//   if (email && !validator.isEmail(email)) {
//     return res.status(400).json({ error: 'Format email tidak valid.' });
//   }

//   const conn = await db.getConnection();

//   try {
//     await conn.beginTransaction();

//     const [duplicate] = await conn.execute(
//       `SELECT 1 FROM pengguna WHERE nik = ? OR email = ? OR nama_pengguna = ?`,
//       [nik, email, namaPengguna]
//     );

//     if (duplicate.length > 0) {
//       await conn.rollback();
//       return res.status(400).json({ error: 'NIK, email, atau username sudah digunakan.' });
//     }

//     const hashed = await bcrypt.hash(kataSandi, 10);

//     const [result] = await conn.execute(
//       `INSERT INTO pengguna (
//         nik, nama_lengkap, tanggal_lahir, email, no_hp,
//         nama_pengguna, kata_sandi, status, jabatan, alamat
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         nik,
//         namaLengkap,
//         tanggalLahir,
//         email,
//         noHp,
//         namaPengguna,
//         hashed,
//         status,
//         jabatan ?? null,
//         alamat ?? null
//       ]
//     );

//     await conn.execute(
//       `INSERT INTO peran_pengguna (id_pengguna, id_peran) VALUES (?, ?)`,
//       [result.insertId, idPeran]
//     );

//     await conn.commit();

//     res.status(201).json({ message: 'Pengguna berhasil ditambahkan.' });
//   } catch (error) {
//     await conn.rollback();
//     console.error('[TAMBAH PENGGUNA MANUAL]', error);
//     res.status(500).json({ error: 'Gagal menambahkan pengguna.' });
//   } finally {
//     conn.release();
//   }
// };

exports.tambahPenggunaManual = async (req, res) => {
  const {
    nik, namaLengkap, tanggalLahir, email, noHp,
    namaPengguna, kataSandi, ulangKataSandi,
    status, jabatan, alamat, idPeran
  } = req.body;

  const fotoProfil = req.file;

  if (!nik || !namaLengkap || !tanggalLahir || !namaPengguna || !kataSandi || !ulangKataSandi || !status || !idPeran) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }

  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: 'Status harus "Aktif" atau "Non-Aktif".' });
  }

  if (kataSandi !== ulangKataSandi) {
    return res.status(400).json({ error: 'Password dan ulangi password tidak sama.' });
  }

  if (!validator.isLength(kataSandi, { min: 6 })) {
    return res.status(400).json({ error: 'Password minimal 6 karakter.' });
  }

  if (!validator.isLength(nik, { min: 16, max: 16 })) {
    return res.status(400).json({ error: 'NIK harus 16 digit.' });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' });
  }

  let namaFileFoto = null;
  if (fotoProfil) {
    const ext = path.extname(fotoProfil.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: 'Format foto tidak valid.' });
    }
    namaFileFoto = fotoProfil.filename;
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [duplicate] = await conn.execute(
      `SELECT 1 FROM pengguna WHERE nik = ? OR email = ? OR nama_pengguna = ?`,
      [nik, email, namaPengguna]
    );

    if (duplicate.length > 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'NIK, email, atau username sudah digunakan.' });
    }

    const hashed = await bcrypt.hash(kataSandi, 10);

    const [result] = await conn.execute(
      `INSERT INTO pengguna (
        nik, nama_lengkap, tanggal_lahir, email, no_hp,
        nama_pengguna, kata_sandi, status, jabatan, alamat, foto_profil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nik,
        namaLengkap,
        tanggalLahir,
        email,
        noHp,
        namaPengguna,
        hashed,
        status,
        jabatan ?? null,
        alamat ?? null,
        namaFileFoto
      ]
    );

    await conn.execute(
      `INSERT INTO peran_pengguna (id_pengguna, id_peran) VALUES (?, ?)`,
      [result.insertId, idPeran]
    );

    await conn.commit();

    res.status(201).json({ message: 'Pengguna berhasil ditambahkan.' });
  } catch (error) {
    await conn.rollback();
    console.error('[TAMBAH PENGGUNA MANUAL]', error);
    res.status(500).json({ error: 'Gagal menambahkan pengguna.' });
  } finally {
    conn.release();
  }
};

/**
 * Ubah data pengguna, termasuk password dan peran
 */
// exports.updatePengguna = async (req, res) => {
//   const { id } = req.params;
//   const {
//     namaLengkap, nik, tanggalLahir, email, noHp, namaPengguna,
//     kataSandi, ulangKataSandi, jabatan, alamat, status, idPeran
//   } = req.body;

//   if (!namaLengkap || !nik || !tanggalLahir || !namaPengguna || !status || !idPeran) {
//     return res.status(400).json({ error: 'Field wajib diisi.' });
//   }

//   if (!validStatus.includes(status)) {
//     return res.status(400).json({ error: 'Status harus "Aktif" atau "Non-Aktif".' });
//   }

//   if (!validator.isLength(nik, { min: 16, max: 16 })) {
//     return res.status(400).json({ error: 'NIK harus 16 digit.' });
//   }

//   if (email && !validator.isEmail(email)) {
//     return res.status(400).json({ error: 'Email tidak valid.' });
//   }

//   if (kataSandi && kataSandi !== ulangKataSandi) {
//     return res.status(400).json({ error: 'Password tidak sama.' });
//   }

//   if (kataSandi && kataSandi.length < 6) {
//     return res.status(400).json({ error: 'Password minimal 6 karakter.' });
//   }

//   const conn = await db.getConnection();

//   try {
//     await conn.beginTransaction();

//     const [exists] = await conn.execute(
//       `SELECT id_pengguna FROM pengguna
//        WHERE (nik=? OR email=? OR nama_pengguna=?) AND id_pengguna!=?`,
//       [nik, email, namaPengguna, id]
//     );

//     if (exists.length) {
//       await conn.rollback();
//       return res.status(400).json({ error: 'NIK/Email/Username sudah digunakan.' });
//     }

//     let sql = `UPDATE pengguna SET nama_lengkap=?, nik=?, tanggal_lahir=?, email=?, no_hp=?, nama_pengguna=?, status=?, jabatan=?, alamat=?, diperbarui_pada=NOW()`;
//     const params = [namaLengkap, nik, tanggalLahir, email, noHp, namaPengguna, status, jabatan, alamat];

//     if (kataSandi) {
//       const hashed = await bcrypt.hash(kataSandi, 10);
//       sql += `, kata_sandi=?`;
//       params.push(hashed);
//     }

//     sql += ` WHERE id_pengguna=?`;
//     params.push(id);

//     await conn.execute(sql, params);

//     await conn.execute(
//       `UPDATE peran_pengguna SET id_peran=? WHERE id_pengguna=?`,
//       [idPeran, id]
//     );

//     await conn.commit();

//     res.json({ message: 'Pengguna berhasil diperbarui.' });
//   } catch (err) {
//     await conn.rollback();
//     console.error('[UPDATE PENGGUNA]', err);
//     res.status(500).json({ error: 'Gagal memperbarui pengguna.' });
//   } finally {
//     conn.release();
//   }
// };
exports.updatePengguna = async (req, res) => {
  const { id } = req.params;
  const {
    namaLengkap, nik, tanggalLahir, email, noHp, namaPengguna,
    kataSandi, ulangKataSandi, jabatan, alamat, status, idPeran
  } = req.body;

  const fotoProfil = req.file;

  if (!namaLengkap || !nik || !tanggalLahir || !namaPengguna || !status || !idPeran) {
    return res.status(400).json({ error: 'Field wajib diisi.' });
  }

  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: 'Status harus "Aktif" atau "Non-Aktif".' });
  }

  if (!validator.isLength(nik, { min: 16, max: 16 })) {
    return res.status(400).json({ error: 'NIK harus 16 digit.' });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email tidak valid.' });
  }

  if (kataSandi && kataSandi !== ulangKataSandi) {
    return res.status(400).json({ error: 'Password tidak sama.' });
  }

  if (kataSandi && kataSandi.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter.' });
  }

  let namaFileFoto = null;
  if (fotoProfil) {
    const ext = path.extname(fotoProfil.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!allowed.includes(ext)) {
      return res.status(400).json({ error: 'Format foto tidak valid.' });
    }
    namaFileFoto = fotoProfil.filename;
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [exists] = await conn.execute(
      `SELECT id_pengguna FROM pengguna
       WHERE (nik=? OR email=? OR nama_pengguna=?) AND id_pengguna!=?`,
      [nik, email, namaPengguna, id]
    );

    if (exists.length) {
      await conn.rollback();
      return res.status(400).json({ error: 'NIK/Email/Username sudah digunakan.' });
    }

    let sql = `UPDATE pengguna SET nama_lengkap=?, nik=?, tanggal_lahir=?, email=?, no_hp=?, nama_pengguna=?, status=?, jabatan=?, alamat=?, diperbarui_pada=NOW()`;
    const params = [namaLengkap, nik, tanggalLahir, email, noHp, namaPengguna, status, jabatan, alamat];

    if (kataSandi) {
      const hashed = await bcrypt.hash(kataSandi, 10);
      sql += `, kata_sandi=?`;
      params.push(hashed);
    }

    if (namaFileFoto) {
      sql += `, foto_profil=?`;
      params.push(namaFileFoto);
    }

    sql += ` WHERE id_pengguna=?`;
    params.push(id);

    await conn.execute(sql, params);

    await conn.execute(
      `UPDATE peran_pengguna SET id_peran=? WHERE id_pengguna=?`,
      [idPeran, id]
    );

    await conn.commit();

    res.json({ message: 'Pengguna berhasil diperbarui.' });
  } catch (err) {
    await conn.rollback();
    console.error('[UPDATE PENGGUNA]', err);
    res.status(500).json({ error: 'Gagal memperbarui pengguna.' });
  } finally {
    conn.release();
  }
};

/**
 * Hapus pengguna
 */
exports.deletePengguna = async (req, res) => {
  const { id } = req.params;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Hapus peran pengguna dulu karena ada foreign key
    await conn.execute('DELETE FROM peran_pengguna WHERE id_pengguna = ?', [id]);

    // Hapus pengguna
    const [result] = await conn.execute('DELETE FROM pengguna WHERE id_pengguna = ?', [id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    await conn.commit();
    res.json({ message: 'Pengguna berhasil dihapus.' });
  } catch (error) {
    await conn.rollback();
    console.error('[DELETE PENGGUNA]', error);
    res.status(500).json({ error: 'Gagal menghapus pengguna.' });
  } finally {
    conn.release();
  }
};
