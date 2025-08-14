const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const SSEService = require('./services/sse');

dotenv.config();

// ==================== INITIALIZE EXPRESS & HTTP SERVER ====================
const app = express();
const server = http.createServer(app);

// ==================== BASIC MIDDLEWARE ====================
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== CREATE UPLOAD DIRECTORIES IF NOT EXISTS ====================
const uploadDirs = ['uploads/thumbnails', 'uploads/galeri', 'uploads/dokumen', 'uploads/profil'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ==================== SERVE STATIC FILES ====================
app.use('/uploads/thumbnails', express.static(path.join(__dirname, 'uploads/thumbnails')));
app.use('/uploads/galeri', express.static(path.join(__dirname, 'uploads/galeri')));
app.use('/uploads/dokumen', express.static(path.join(__dirname, 'uploads/dokumen')));
app.use('/uploads/profil', express.static(path.join(__dirname, 'uploads/profil')));

// ==================== ROUTES ====================
// AUTH
app.use('/api/auth', require('./routes/authRoutes'));

// ==================== GUEST & PENDUDUK ====================
const guestPendudukRoutes = require('./routes/guestPendudukRoutes');
const beritaRoutes = require('./routes/guestPenduduk/beritaRoutes');
const sejarahRoutes = require('./routes/guestPenduduk/sejarahRoutes');
const profilDesaRoutes = require('./routes/guestPenduduk/profilDesaRoutes');
const galeriDesaRoutes = require('./routes/guestPenduduk/galeriDesaRoutes');
const detailRoutes = require('./routes/guestPenduduk/detailRoutes');

app.use('/api', guestPendudukRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/sejarah', sejarahRoutes);
app.use('/api/profil', profilDesaRoutes);
app.use('/api', galeriDesaRoutes);
app.use('/api', detailRoutes);
app.use('/api/data-desa', require('./routes/guestPenduduk/dataDesaRoutes'));

// ==================== PENGGUNA (WARGA) ====================
const arsipRoutes = require('./routes/penduduk/arsipRoutes');
const agendaRoutes = require('./routes/penduduk/agendaRoutes');
app.use('/pengguna', arsipRoutes);
app.use('/pengguna/agenda', agendaRoutes);

// ==================== ADMIN ====================
app.use('/admin/pengguna', require('./routes/admin/penggunaRoutes'));

// ==================== ADMIN & PENGURUS ====================
app.use('/adminDanPengurus/konten', require('./routes/adminDanPengurus/kontenRoutes'));
app.use('/adminDanPengurus/galeri', require('./routes/adminDanPengurus/galeriRoutes'));
app.use('/adminDanPengurus/agenda', require('./routes/adminDanPengurus/agendaRoutes'));
app.use('/adminDanPengurus/beranda', require('./routes/adminDanPengurus/berandaRoutes'));
app.use('/adminDanPengurus/data-desa', require('./routes/adminDanPengurus/dataDesaRoutes'));
app.use('/adminDanPengurus/dokumen', require('./routes/adminDanPengurus/dokumenRoutes'));
app.use('/adminDanPengurus/profil-desa', require('./routes/adminDanPengurus/profilDesaRoutes'));

// ==================== UMUM ====================
app.use('/api/masukan', require('./routes/masukanRoutes'));
app.use('/api/log-aktivitas', require('./routes/logAktivitasRoutes'));

// ==================== SSE ENDPOINT (Multi-Fitur) ====================
app.get('/sse', (req, res) => {
  const feature = req.query.feature;
  if (!feature) {
    return res.status(400).json({ success: false, message: 'Parameter "feature" wajib. Contoh: /sse?feature=data-desa' });
  }

  // Set header SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  SSEService.addClient(feature, res);

  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: {}\n\n`);
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    SSEService.removeClient(feature, res);
  });
});

app.get('/sse-status', (req, res) => {
  const feature = req.query.feature;
  res.json({
    success: true,
    feature: feature || 'all',
    clientCount: SSEService.getClientCount(feature)
  });
});

// ==================== DEFAULT ROUTE ====================
app.get('/', (req, res) => {
  res.send('✅ API Desa berjalan dengan baik');
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    sse: { 
      totalFeatures: SSEService.clients ? SSEService.clients.size : 0 
    },
    timestamp: new Date().toISOString()
  });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  if (err.message.includes('Format gambar tidak didukung')) {
    return res.status(400).json({ error: err.message });
  }
  
  console.error('Global error handler:', err.stack);
  res.status(500).json({ 
    error: 'Terjadi kesalahan server',
    message: err.message 
  });
});

// ==================== REQUEST LOGGER (OPTIONAL) ====================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  next();
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 SSE endpoint ready at http://localhost:${PORT}/sse?feature=<nama-fitur>`);
});
