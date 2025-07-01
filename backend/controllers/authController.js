const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');

// === Konfigurasi transporter untuk mengirim email melalui Gmail ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // email pengirim
    pass: process.env.EMAIL_PASS      // password aplikasi (bukan password email biasa)
  }
});

// ======================== REGISTRASI PENGGUNA ========================
exports.register = async (req, res) => {
  const {
    nik, nama_lengkap, tanggal_lahir, email,
    no_hp, nama_pengguna, kata_sandi,
    id_peran, foto_profil, jabatan, alamat
  } = req.body;

  // Validasi field wajib
  if (!nik || !nama_lengkap || !tanggal_lahir || !email || !nama_pengguna || !kata_sandi || !id_peran) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }

  // Validasi format NIK, email, dan panjang password
  if (!validator.isLength(nik, { min: 16, max: 16 })) {
    return res.status(400).json({ error: 'NIK harus 16 digit.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email tidak valid.' });
  }
  if (!validator.isLength(kata_sandi, { min: 6 })) {
    return res.status(400).json({ error: 'Password minimal 6 karakter.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Cek apakah NIK, email, atau username sudah digunakan
    const [existing] = await conn.execute(
      `SELECT 1 FROM pengguna WHERE nik = ? OR email = ? OR nama_pengguna = ?`,
      [nik, email, nama_pengguna]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'NIK, Email, atau Username sudah digunakan.' });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(kata_sandi, 10);

    // Simpan data pengguna ke tabel `pengguna`
    const [userResult] = await conn.execute(
      `INSERT INTO pengguna (
        nik, nama_lengkap, tanggal_lahir, email, no_hp,
        nama_pengguna, kata_sandi, foto_profil, jabatan, alamat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nik, nama_lengkap, tanggal_lahir, email, no_hp,
        nama_pengguna, hashedPassword,
        foto_profil || null, jabatan || null, alamat || null
      ]
    );

    const id_pengguna = userResult.insertId;

    // Simpan relasi peran ke tabel `peran_pengguna`
    await conn.execute(
      `INSERT INTO peran_pengguna (id_pengguna, id_peran) VALUES (?, ?)`,
      [id_pengguna, id_peran]
    );

    await conn.commit();
    res.status(201).json({ message: 'Registrasi berhasil.' });
  } catch (error) {
    await conn.rollback();
    console.error('[REGISTER]', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Data duplikat ditemukan.' });
    }
    res.status(500).json({ error: 'Gagal registrasi.' });
  } finally {
    conn.release(); // Pastikan koneksi ditutup setelah selesai
  }
};

// ======================== LOGIN PENGGUNA ========================
exports.login = async (req, res) => {
  const { nik, kata_sandi } = req.body;

  try {
    // Ambil data pengguna berdasarkan NIK
    const [rows] = await db.execute(
      `SELECT 
        p.id_pengguna, p.nama_lengkap, p.nik, p.kata_sandi,
        r.id AS id_peran, r.nama_peran
       FROM pengguna p
       JOIN peran_pengguna rp ON p.id_pengguna = rp.id_pengguna
       JOIN peran r ON rp.id_peran = r.id
       WHERE p.nik = ? AND p.status = 'Aktif'`,
      [nik]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Pengguna tidak ditemukan.' });
    }

    const user = rows[0];

    // Verifikasi password
    const match = await bcrypt.compare(kata_sandi, user.kata_sandi);
    if (!match) return res.status(401).json({ error: 'Kata sandi salah.' });

    // Ambil semua peran yang dimiliki pengguna
    const roles = rows.map(row => ({
      id_peran: row.id_peran,
      nama_peran: row.nama_peran
    }));

    res.json({
      message: 'Login berhasil. Silakan pilih peran.',
      pengguna: {
        id: user.id_pengguna,
        nama: user.nama_lengkap,
        nik: user.nik
      },
      roles
    });
  } catch (error) {
    console.error('[LOGIN]', error);
    res.status(500).json({ error: 'Gagal login.' });
  }
};

// ======================== PILIH PERAN (SETELAH LOGIN) ========================
exports.selectRole = async (req, res) => {
  const { id_pengguna, id_peran } = req.body;

  try {
    // Cek apakah pengguna memiliki peran tersebut
    const [rows] = await db.execute(
      `SELECT 1 FROM peran_pengguna WHERE id_pengguna = ? AND id_peran = ?`,
      [id_pengguna, id_peran]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'Peran tidak valid untuk pengguna ini.' });
    }

    // Ambil data pengguna & peran untuk payload token
    const [[userData]] = await db.execute(
      `SELECT p.nama_lengkap, r.nama_peran
       FROM pengguna p
       JOIN peran r ON r.id = ?
       WHERE p.id_pengguna = ?`,
      [id_peran, id_pengguna]
    );

    // Buat JWT token
    const token = jwt.sign(
      {
        id: id_pengguna,
        id_peran,
        nama: userData.nama_lengkap,
        peran: userData.nama_peran
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update login terakhir
    await db.execute(
      `UPDATE pengguna SET login_terakhir = NOW() WHERE id_pengguna = ?`,
      [id_pengguna]
    );

    // Simpan log aktivitas
    await db.execute(
      `INSERT INTO log_aktivitas (id_pengguna, jenis_log) VALUES (?, 'Login Pengguna')`,
      [id_pengguna]
    );

    res.json({ message: 'Peran dipilih.', token });
  } catch (error) {
    console.error('[SELECT ROLE]', error);
    res.status(500).json({ error: 'Gagal memilih peran.' });
  }
};

// ======================== REQUEST LINK RESET PASSWORD ========================
exports.requestChangePassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email tidak valid.' });
  }

  try {
    // Cari pengguna berdasarkan email
    const [rows] = await db.execute(
      `SELECT id_pengguna, nama_lengkap FROM pengguna WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pengguna dengan email ini tidak ditemukan.' });
    }

    const user = rows[0];

    // Buat token JWT untuk reset password
    const token = jwt.sign(
      { id_pengguna: user.id_pengguna, email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // token berlaku 15 menit
    );

    // Link yang dikirim via email
    const resetLink = `http://localhost:5173/change-password?token=${token}`;

    // Kirim email berisi link reset
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Permintaan Ubah Password - SIDA',
      html: `
        <div style="font-family:sans-serif">
          <p>Halo ${user.nama_lengkap},</p>
          <p>Kamu baru saja meminta ubah password. Klik link berikut untuk melanjutkan:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p><b>Link hanya berlaku selama 15 menit.</b></p>
          <hr/>
          <small>Email ini dikirim otomatis oleh Sistem Informasi Desa Adat Cengkilung.
          Jika kamu tidak meminta reset password, abaikan saja email ini.</small>
        </div>
      `
    });

    res.json({ message: 'Link ubah password telah dikirim ke email.' });
  } catch (error) {
    console.error('[REQUEST CHANGE PASSWORD]', error);
    res.status(500).json({ error: 'Gagal mengirim email ubah password.' });
  }
};

// ======================== PROSES GANTI PASSWORD DARI EMAIL ========================
exports.changePasswordViaEmail = async (req, res) => {
  const { token, password_lama, password_baru } = req.body;

  if (!token || !password_lama || !password_baru) {
    return res.status(400).json({ error: 'Semua field wajib diisi.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_pengguna = decoded.id_pengguna;

    // Ambil password lama pengguna dari database
    const [rows] = await db.execute(
      `SELECT kata_sandi FROM pengguna WHERE id_pengguna = ?`,
      [id_pengguna]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    const valid = await bcrypt.compare(password_lama, rows[0].kata_sandi);
    if (!valid) {
      return res.status(400).json({ error: 'Password lama salah.' });
    }

    if (!validator.isLength(password_baru, { min: 6 })) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
    }

    const hashed = await bcrypt.hash(password_baru, 10);
    await db.execute(
      `UPDATE pengguna SET kata_sandi = ?, diperbarui_pada = NOW() WHERE id_pengguna = ?`,
      [hashed, id_pengguna]
    );

    res.json({ message: 'Password berhasil diubah.' });
  } catch (error) {
    console.error('[CHANGE PASSWORD VIA EMAIL]', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Link kadaluarsa, silakan minta ulang.' });
    }
    res.status(500).json({ error: 'Gagal mengubah password.' });
  }
};

// ======================== AMBIL DATA PENGGUNA SAAT INI ========================
exports.getCurrentUser = async (req, res) => {
  const { id, id_peran } = req.user; // Payload token dari middleware auth

  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id_pengguna, p.nama_lengkap, p.email, r.nama_peran
      FROM pengguna p
      JOIN peran r ON r.id = ?
      WHERE p.id_pengguna = ?
    `, [id_peran, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
    }

    res.json({
      id: rows[0].id_pengguna,
      nama: rows[0].nama_lengkap,
      email: rows[0].email,
      peran: rows[0].nama_peran
    });
  } catch (error) {
    console.error('[GET CURRENT USER]', error);
    res.status(500).json({ error: 'Gagal mengambil data pengguna.' });
  }
};
