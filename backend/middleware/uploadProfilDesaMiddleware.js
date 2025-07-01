const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profil');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profil-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filter jenis file
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format gambar tidak didukung'), false);
  }
};

module.exports = multer({ storage, fileFilter });
