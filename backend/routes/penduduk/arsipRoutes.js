const express = require('express');
const router = express.Router();
const { getArsipDesa } = require('../../controllers/penduduk/arsipController');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');

// Route ini hanya bisa diakses oleh pengguna dengan peran = 3 (Warga/Masyarakat)
router.get('/arsip', verifyTokenRequired, authorizeRoles(3), getArsipDesa);

module.exports = router;
