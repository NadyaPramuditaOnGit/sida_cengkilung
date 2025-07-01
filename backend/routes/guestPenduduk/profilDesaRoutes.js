const express = require('express');
const router = express.Router();
const { verifyTokenOptional } = require('../../middleware/authMiddleware');
const profilDesaController = require('../../controllers/guestPenduduk/profilDesaController');

// Endpoint untuk gambaran umum desa
router.get('/profil/gambaran-umum', verifyTokenOptional, profilDesaController.getGambaranUmum);

// Endpoint untuk perangkat desa (slider)
router.get('/profil/perangkat-desa', verifyTokenOptional, profilDesaController.getPerangkatDesa);

module.exports = router;
