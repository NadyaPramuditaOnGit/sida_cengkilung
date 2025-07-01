const express = require('express');
const router = express.Router();
const berandaController = require('../../controllers/adminDanPengurus/berandaController');
const { verifyTokenOptional, verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');

// ============ Guest & Warga ============
// Beranda umum (statistik + konten untuk ditampilkan di landing)
router.get('/', verifyTokenOptional, berandaController.getBeranda);

// ============ Admin & Pengurus ============
// Statistik dashboard admin/pengurus
router.get('/statistik', verifyTokenRequired, authorizeRoles(1, 2), berandaController.getStatistikBulanIni);
router.get('/berita-terkini', verifyTokenRequired, authorizeRoles(1, 2), berandaController.getBeritaPengumumanTerkini);
router.get('/agenda-terkini', verifyTokenRequired, authorizeRoles(1, 2), berandaController.getAgendaTerkini);
router.get('/galeri-terkini', verifyTokenRequired, authorizeRoles(1, 2), berandaController.getGaleriTerkini);
router.get('/data-desa-statistik', verifyTokenRequired, authorizeRoles(1, 2), berandaController.getDataDesaStatistik);

// CRUD konten beranda (khusus Admin)
router.get('/konten', verifyTokenRequired, authorizeRoles(1), berandaController.getAllBeranda);
router.get('/konten/:id', verifyTokenRequired, authorizeRoles(1), berandaController.getBerandaById);
router.post('/konten', verifyTokenRequired, authorizeRoles(1), berandaController.createBeranda);
router.put('/konten/:id', verifyTokenRequired, authorizeRoles(1), berandaController.updateBeranda);
router.delete('/konten/:id', verifyTokenRequired, authorizeRoles(1), berandaController.deleteBeranda);

module.exports = router;
