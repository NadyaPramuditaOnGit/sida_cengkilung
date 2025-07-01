const multer = require('multer');
const path = require('path');

// Penyimpanan file di folder uploads/galeri
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/galeri'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

// Filter file yang diizinkan: hanya gambar untuk foto dan video untuk video
const fileFilter = (req, file, cb) => {
  // Boleh diperluas jika ingin support video format tertentu
  const allowedImage = /\.(jpg|jpeg|png|webp|gif)$/i;
  const allowedVideo = /\.(mp4|avi|mov|wmv|mkv)$/i;

  if (req.body.jenis_media === 'Foto') {
    if (!allowedImage.test(file.originalname)) {
      return cb(new Error('Format file foto tidak didukung.'));
    }
  } else if (req.body.jenis_media === 'Video') {
    if (!allowedVideo.test(file.originalname)) {
      return cb(new Error('Format file video tidak didukung.'));
    }
  } else {
    return cb(new Error('Jenis media tidak valid.'));
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // max 20MB, bisa disesuaikan
}).array('files', 15); // maksimal 15 file upload
