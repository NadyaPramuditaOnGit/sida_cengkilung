const express = require('express');
const router = express.Router();
const dataDesaController = require('../../controllers/guestPenduduk/dataDesaController');
const { verifyTokenOptional } = require('../../middleware/authMiddleware');

/**
 * Route untuk ambil data desa berdasarkan jenis_data
 * Bisa diakses Guest maupun Warga (login optional)
 */
router.get('/data-desa', verifyTokenOptional, dataDesaController.getDataDesaByJenis);

/**
 * Route untuk ambil total summary data desa per jenis_data
 * Bisa diakses Guest maupun Warga (login optional)
 */
router.get('/data-desa/total', verifyTokenOptional, dataDesaController.getTotalDataDesaByJenis);

module.exports = router;
