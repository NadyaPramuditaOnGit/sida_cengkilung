const express = require('express');
const router = express.Router();
const logAktivitasController = require('../controllers/logAktivitasController');
const { verifyTokenRequired } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/peranMiddleware');

// GET semua log (admin saja)
router.get('/', verifyTokenRequired, verifyAdmin, logAktivitasController.getAllLogs);

// GET log berdasarkan pengguna (boleh akses sendiri atau admin)
router.get('/:id_pengguna', verifyTokenRequired, logAktivitasController.getLogsByUser);

// POST log aktivitas (tidak perlu login)
router.post('/', logAktivitasController.createLog);

module.exports = router;
