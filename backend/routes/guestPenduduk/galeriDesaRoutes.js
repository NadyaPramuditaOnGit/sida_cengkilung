const express = require('express');
const router = express.Router();
const galeriController = require('../../controllers/guestPenduduk/galeriDesaController');
const { verifyTokenOptional } = require('../../middleware/authMiddleware');

/**
 * Semua endpoint login optional:
 * - /video
 * - /foto
 */
router.get('/galeri/video', verifyTokenOptional, galeriController.getVideoSection);
router.get('/galeri/foto', verifyTokenOptional, galeriController.getFotoSection);

module.exports = router;
