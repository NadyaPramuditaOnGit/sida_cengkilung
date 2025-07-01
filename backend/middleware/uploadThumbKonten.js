const multer = require('multer');
const path = require('path');

// Direktori penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/thumbnails'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random()*1e9) + ext;
    cb(null, name);
  }
});

// Filter format file
const fileFilter = (req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
  if (!allowed.test(file.originalname)) return cb(new Error('Format gambar tidak didukung.'));
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2*1024*1024 } // max 2MB
});
