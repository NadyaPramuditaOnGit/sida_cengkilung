const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Middleware verifikasi token JWT wajib.
 * Untuk route yang mengharuskan login seperti admin/pengurus.
 */
const verifyTokenRequired = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('[verifyTokenRequired] Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[verifyTokenRequired] ❌ Token tidak ditemukan atau format salah.');
    return res.status(401).json({ error: 'Token tidak ditemukan atau format salah.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[verifyTokenRequired] ✅ Token berhasil diverifikasi:', decoded);

    const [rows] = await db.execute(
      `SELECT p.id_pengguna, p.nama_lengkap, pr.nama_peran, pr.id as id_peran
       FROM pengguna p
       JOIN peran_pengguna pp ON p.id_pengguna = pp.id_pengguna
       JOIN peran pr ON pp.id_peran = pr.id
       WHERE p.id_pengguna = ? LIMIT 1`,
      [decoded.id]
    );

    if (!rows.length) {
      console.log('[verifyTokenRequired] ❌ Pengguna tidak ditemukan di database:', decoded.id);
      return res.status(403).json({ error: 'Pengguna tidak ditemukan di database.' });
    }

    req.user = {
      id: rows[0].id_pengguna,
      nama_lengkap: rows[0].nama_lengkap,
      nama_peran: rows[0].nama_peran,
      id_peran: rows[0].id_peran,
    };

    console.log('[verifyTokenRequired] ✅ Data pengguna:', req.user);
    next();
  } catch (err) {
    console.log('[verifyTokenRequired] ❌ Token invalid atau expired:', err.message);
    return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

/**
 * Middleware verifikasi token JWT opsional.
 * Untuk route yang bisa diakses guest dan login.
 */
const verifyTokenOptional = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('[verifyTokenOptional] Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[verifyTokenOptional] Token tidak ditemukan, dianggap guest.');
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[verifyTokenOptional] ✅ Token berhasil diverifikasi:', decoded);

    const [rows] = await db.execute(
      `SELECT p.id_pengguna, p.nama_lengkap, pr.nama_peran, pr.id as id_peran
       FROM pengguna p
       JOIN peran_pengguna pp ON p.id_pengguna = pp.id_pengguna
       JOIN peran pr ON pp.id_peran = pr.id
       WHERE p.id_pengguna = ? LIMIT 1`,
      [decoded.id]
    );

    if (!rows.length) {
      console.log('[verifyTokenOptional] ❌ Pengguna tidak ditemukan.');
      req.user = null;
      return next();
    }

    req.user = {
      id: rows[0].id_pengguna,
      nama_lengkap: rows[0].nama_lengkap,
      nama_peran: rows[0].nama_peran,
      id_peran: rows[0].id_peran,
    };

    console.log('[verifyTokenOptional] ✅ Data pengguna:', req.user);
    next();
  } catch (err) {
    console.log('[verifyTokenOptional] ❌ Token invalid:', err.message);
    req.user = null;
    next();
  }
};

/**
 * Middleware otorisasi role/peran.
 * Contoh penggunaan: authorizeRoles(1, 2) untuk Admin dan Perangkat.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('[authorizeRoles] Dibutuhkan id_peran:', allowedRoles);
    console.log('[authorizeRoles] Data req.user:', req.user);

    if (!req.user || !allowedRoles.includes(req.user.id_peran)) {
      console.log('[authorizeRoles] ❌ Akses ditolak. id_peran:', req.user?.id_peran);
      return res.status(403).json({ error: 'Akses ditolak. Peran tidak memiliki izin.' });
    }

    console.log('[authorizeRoles] ✅ Akses diizinkan untuk peran:', req.user.id_peran);
    next();
  };
};

module.exports = {
  verifyTokenRequired,
  verifyTokenOptional,
  authorizeRoles,
};
