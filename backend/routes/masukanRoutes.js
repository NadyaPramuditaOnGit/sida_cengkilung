const express = require('express');
const router = express.Router();
const masukanController = require('../controllers/masukanController');
const { verifyTokenRequired } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/peranMiddleware');

// Kirim masukan (tidak perlu login)
router.post('/', masukanController.createMasukan);

// Admin akses
router.get('/', verifyTokenRequired, verifyAdmin, masukanController.getAllMasukan);
router.get('/:id', verifyTokenRequired, verifyAdmin, masukanController.getMasukanById);
router.put('/:id', verifyTokenRequired, verifyAdmin, masukanController.respondMasukan);
router.delete('/:id', verifyTokenRequired, verifyAdmin, masukanController.deleteMasukan);

module.exports = router;