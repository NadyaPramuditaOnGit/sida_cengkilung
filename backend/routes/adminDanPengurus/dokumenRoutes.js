const express = require('express');
const router = express.Router();
const dokumenController = require('../../controllers/adminDanPengurus/dokumenController');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../utils/uploadDokumen');

// Semua endpoint diakses oleh Admin
router.get('/', verifyTokenRequired, authorizeRoles(1, 2), dokumenController.getDokumenList);
router.get('/:id', verifyTokenRequired, authorizeRoles(1, 2), dokumenController.getDokumenById);
router.post('/', verifyTokenRequired, authorizeRoles(1, 2), upload.single('file'), dokumenController.createDokumen);
router.put('/:id', verifyTokenRequired, authorizeRoles(1, 2), upload.single('file'), dokumenController.updateDokumen);
router.delete('/:id', verifyTokenRequired, authorizeRoles(1, 2), dokumenController.deleteDokumen);

module.exports = router;
