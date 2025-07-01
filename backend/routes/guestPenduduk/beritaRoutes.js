const express = require('express');
const router = express.Router();
const beritaController = require('../../controllers/guestPenduduk/beritaController');
const { verifyTokenOptional } = require('../../middleware/authMiddleware');

// GET /berita -> daftar berita untuk guest & pengguna
router.get('/', verifyTokenOptional, beritaController.getDaftarBerita);

module.exports = router;
