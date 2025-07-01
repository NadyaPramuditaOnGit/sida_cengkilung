const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Middleware verifikasi token JWT wajib.
 * Jika token tidak ada atau invalid, akan langsung respon error.
 * Untuk route yang wajib login seperti admin, pengurus.
 */
const verifyTokenRequired = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan atau format salah.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Biasanya minimal { id, id_peran, ... }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

/**
 * Middleware verifikasi token JWT opsional.
 * Jika token valid, req.user berisi data user lengkap dari DB.
 * Jika token tidak ada atau invalid, req.user = null (guest).
 * Cocok untuk halaman yang bisa diakses guest & user login.
 */
const verifyTokenOptional = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null; // dianggap guest
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data user lengkap dari DB (untuk header, beranda, dll)
    const [rows] = await db.execute(
      `SELECT p.id_pengguna, p.nama_lengkap, pr.nama_peran, pr.id as id_peran
       FROM pengguna p
       JOIN peran_pengguna pp ON p.id_pengguna = pp.id_pengguna
       JOIN peran pr ON pp.id_peran = pr.id
       WHERE p.id_pengguna = ? LIMIT 1`,
      [decoded.id]
    );

    if (!rows.length) {
      req.user = null;
      return next();
    }

    req.user = {
      id: rows[0].id_pengguna,
      nama_lengkap: rows[0].nama_lengkap,
      nama_peran: rows[0].nama_peran,
      id_peran: rows[0].id_peran,
    };

    next();
  } catch (err) {
    req.user = null; // token invalid dianggap guest
    next();
  }
};

/**
 * Middleware otorisasi role/peran.
 * Menerima argumen daftar id_peran yang diizinkan akses.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.id_peran)) {
      return res.status(403).json({ error: 'Akses ditolak. Peran tidak memiliki izin.' });
    }
    next();
  };
};

module.exports = {
  verifyTokenRequired,
  verifyTokenOptional,
  authorizeRoles,
};
