// const express = require('express');
// const router = express.Router();
// const penggunaController = require('../../controllers/admin/penggunaController');
// const { verifyTokenRequired, isAdmin } = require('../../middleware/authMiddleware');
// const upload = require('../../middleware/uploadFotoPenggunaMiddleware');

// // Semua route khusus Admin dengan middleware
// // router.post('/tambah', verifyTokenRequired, isAdmin, penggunaController.tambahPenggunaManual);
// // Tambah pengguna (pakai upload.single)
// router.post('/tambah', verifyTokenRequired, isAdmin, upload.single('foto_profil'), penggunaController.tambahPenggunaManual);
// router.get('/', verifyTokenRequired, isAdmin, penggunaController.getAllPengguna);
// router.get('/:id', verifyTokenRequired, isAdmin, penggunaController.getPenggunaById);
// // router.put('/:id', verifyTokenRequired, isAdmin, penggunaController.updatePengguna);
// // Edit pengguna
// router.put('/:id', verifyTokenRequired, isAdmin, upload.single('foto_profil'), penggunaController.updatePengguna);
// router.delete('/:id', verifyTokenRequired, isAdmin, penggunaController.deletePengguna);

// module.exports = router;


const express = require('express');
const router = express.Router();
const penggunaController = require('../../controllers/admin/penggunaController');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadFotoPenggunaMiddleware');

// Tambah pengguna (hanya Admin - id_peran = 1)
router.post(
  '/tambah',
  verifyTokenRequired,
  authorizeRoles(1),
  upload.single('foto_profil'),
  penggunaController.tambahPenggunaManual
);

// Ambil semua pengguna (Admin)
router.get(
  '/',
  verifyTokenRequired,
  authorizeRoles(1),
  penggunaController.getAllPengguna
);

// Ambil data pengguna by ID (Admin)
router.get(
  '/:id',
  verifyTokenRequired,
  authorizeRoles(1),
  penggunaController.getPenggunaById
);

// Edit pengguna (Admin)
router.put(
  '/:id',
  verifyTokenRequired,
  authorizeRoles(1),
  upload.single('foto_profil'),
  penggunaController.updatePengguna
);

// Hapus pengguna (Admin)
router.delete(
  '/:id',
  verifyTokenRequired,
  authorizeRoles(1),
  penggunaController.deletePengguna
);

module.exports = router;
