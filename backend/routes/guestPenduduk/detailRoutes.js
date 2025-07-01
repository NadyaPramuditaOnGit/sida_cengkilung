const express = require('express');
const router = express.Router();
const { getDetailKonten } = require('../../controllers/guestPenduduk/detailController');
const { verifyTokenOptional } = require('../../middleware/authMiddleware');

// Route: Detail konten berita/pengumuman berdasarkan ID (untuk Guest & Warga)
router.get('/detail/:id', verifyTokenOptional, getDetailKonten);

module.exports = router;
