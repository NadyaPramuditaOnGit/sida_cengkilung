// utils/uploadGambarAgenda.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat folder ./uploads/agenda jika belum ada
const folderPath = path.join(__dirname, '../uploads/agenda');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Konfigurasi penyimpanan file agenda
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `agenda_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Filter file hanya menerima gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  cb(null, allowedTypes.test(ext));
};

module.exports = multer({ storage, fileFilter });
