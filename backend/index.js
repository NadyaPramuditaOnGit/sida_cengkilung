const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
const app = express();

// ==================== MIDDLEWARE DASAR ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== BUAT FOLDER UPLOADS JIKA BELUM ADA ====================
const uploadDirs = ['uploads/thumbnails', 'uploads/galeri', 'uploads/dokumen', 'uploads/profil'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ==================== SERVE STATIC FILE UPLOADS ====================
app.use('/uploads/thumbnails', express.static(path.join(__dirname, 'uploads/thumbnails')));
app.use('/uploads/galeri', express.static(path.join(__dirname, 'uploads/galeri')));
app.use('/uploads/dokumen', express.static(path.join(__dirname, 'uploads/dokumen')));
app.use('/uploads/profil', express.static(path.join(__dirname, 'uploads/profil')));

// ==================== ROUTES: AUTH ====================
app.use('/api/auth', require('./routes/authRoutes'));

// ==================== ROUTES: GUEST & PENDUDUK ====================
const guestPendudukRoutes = require('./routes/guestPendudukRoutes');
const beritaRoutes = require('./routes/guestPenduduk/beritaRoutes');
const sejarahRoutes = require('./routes/guestPenduduk/sejarahRoutes');
const profilDesaRoutes = require('./routes/guestPenduduk/profilDesaRoutes');
const galeriDesaRoutes = require('./routes/guestPenduduk/galeriDesaRoutes');
const detailRoutes = require('./routes/guestPenduduk/detailRoutes');
const dataDesaRoutes = require('./routes/guestPenduduk/dataDesaRoutes');
const agendaRoutes = require('./routes/guestPenduduk/agendaRoutes');

app.use('/api', guestPendudukRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/sejarah', sejarahRoutes);
app.use('/api', profilDesaRoutes);
app.use('/api', galeriDesaRoutes);
app.use('/api', detailRoutes);
app.use('/api', dataDesaRoutes);
app.use('/api/agenda', agendaRoutes);

// ==================== ROUTES: PENGGUNA (WARGA) ====================
const arsipRoutes = require('./routes/penduduk/arsipRoutes');
app.use('/pengguna', arsipRoutes);

// ==================== ROUTES: ADMIN ====================
app.use('/admin/pengguna', require('./routes/admin/penggunaRoutes'));

// ==================== ROUTES: ADMIN & PENGURUS ====================
app.use('/adminDanPengurus/konten', require('./routes/adminDanPengurus/kontenRoutes'));
app.use('/adminDanPengurus/galeri', require('./routes/adminDanPengurus/galeriRoutes'));
app.use('/adminDanPengurus/agenda', require('./routes/adminDanPengurus/agendaRoutes'));
app.use('/adminDanPengurus/beranda', require('./routes/adminDanPengurus/berandaRoutes'));
app.use('/adminDanPengurus/data-desa', require('./routes/adminDanPengurus/dataDesaRoutes'));
app.use('/adminDanPengurus/dokumen', require('./routes/adminDanPengurus/dokumenRoutes'));
app.use('/adminDanPengurus/profil-desa', require('./routes/adminDanPengurus/profilDesaRoutes'));

// ==================== ROUTES: UMUM ====================
app.use('/api/masukan', require('./routes/masukanRoutes'));
app.use('/api/log-aktivitas', require('./routes/logAktivitasRoutes'));

// ==================== DEFAULT ROUTE ====================
app.get('/', (req, res) => {
  res.send('✅ API Desa berjalan dengan baik');
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  if (err.message.includes('Format gambar tidak didukung')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
