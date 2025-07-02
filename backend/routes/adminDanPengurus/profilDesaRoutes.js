const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');
const profilDesaController = require('../../controllers/adminDanPengurus/profilDesaController');

// Hanya Admin & Pengurus
const rolesAllowed = authorizeRoles(1, 2);

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profil');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = 'profil-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, filename);
  }
});
const upload = multer({ storage });

// Ambil data Perangkat Desa dengan pagination (PASTIKAN POSISI INI DI ATAS)
router.get('/perangkat', verifyTokenRequired, rolesAllowed, profilDesaController.getPerangkatDesa);

// Ambil data profil berdasarkan bagian (route catch-all harus di bawah)
router.get('/:bagian', verifyTokenRequired, rolesAllowed, profilDesaController.getProfilByBagian);

// Update deskripsi / video profil
router.put('/:id', verifyTokenRequired, rolesAllowed, profilDesaController.updateProfil);

// Upload gambar profil (maks 15)
router.post('/:bagian/upload-foto', verifyTokenRequired, rolesAllowed, upload.array('foto', 15), profilDesaController.uploadGambarProfil);

// Hapus gambar berdasarkan nama file
router.delete('/foto/:filename', verifyTokenRequired, rolesAllowed, profilDesaController.deleteFotoProfil);

module.exports = router;
