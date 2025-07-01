const express = require('express');
const router = express.Router();
const { verifyTokenOptional } = require('../middleware/authMiddleware');
const headerController = require('../controllers/guestPenduduk/headerController');
const berandaController = require('../controllers/guestPenduduk/berandaController');

// Endpoint header - bisa diakses guest dan penduduk
router.get('/header', verifyTokenOptional, headerController.getHeaderInfo);

// Endpoint beranda - bisa diakses guest dan penduduk
router.get('/beranda', verifyTokenOptional, berandaController.getBeranda);


// Import route sejarah
const sejarahRoutes = require('./guestPenduduk/sejarahRoutes');
// Gunakan subroute sejarah
router.use('/', sejarahRoutes);



module.exports = router;
