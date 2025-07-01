// Middleware upload khusus file dokumen
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/dokumen');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'dokumen-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Validasi ekstensi file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak diperbolehkan.'));
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
