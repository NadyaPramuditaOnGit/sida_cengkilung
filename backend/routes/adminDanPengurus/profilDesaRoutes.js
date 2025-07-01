const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyTokenRequired } = require('../../middleware/authMiddleware');
const { verifyAdmin } = require('../../middleware/peranMiddleware');
const profilDesaController = require('../../controllers/adminDanPengurus/profilDesaController');

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
router.get('/perangkat', verifyTokenRequired, verifyAdmin, profilDesaController.getPerangkatDesa);

// Ambil data profil berdasarkan bagian (route catch-all harus di bawah)
router.get('/:bagian', verifyTokenRequired, verifyAdmin, profilDesaController.getProfilByBagian);

// Update deskripsi / video profil
router.put('/:id', verifyTokenRequired, verifyAdmin, profilDesaController.updateProfil);

// Upload gambar profil (maks 15)
router.post('/:bagian/upload-foto', verifyTokenRequired, verifyAdmin, upload.array('foto', 15), profilDesaController.uploadGambarProfil);

// Hapus gambar berdasarkan nama file
router.delete('/foto/:filename', verifyTokenRequired, verifyAdmin, profilDesaController.deleteFotoProfil);

module.exports = router;
