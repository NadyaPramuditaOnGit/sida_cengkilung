const express = require('express');
const router = express.Router();
const dokumenController = require('../../controllers/adminDanPengurus/dokumenController');
const { verifyTokenRequired } = require('../../middleware/authMiddleware');
const { verifyAdmin } = require('../../middleware/peranMiddleware');
const upload = require('../../utils/uploadDokumen');

// Semua endpoint diakses oleh Admin
router.get('/', verifyTokenRequired, verifyAdmin, dokumenController.getDokumenList);
router.get('/:id', verifyTokenRequired, verifyAdmin, dokumenController.getDokumenById);
router.post('/', verifyTokenRequired, verifyAdmin, upload.single('file'), dokumenController.createDokumen);
router.put('/:id', verifyTokenRequired, verifyAdmin, upload.single('file'), dokumenController.updateDokumen);
router.delete('/:id', verifyTokenRequired, verifyAdmin, dokumenController.deleteDokumen);

module.exports = router;
