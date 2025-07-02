const express = require('express');
const router = express.Router();
const dataDesaController = require('../../controllers/adminDanPengurus/dataDesaController');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');

// Admin (1) dan Pengurus (2)
router.get('/', verifyTokenRequired, authorizeRoles(1, 2), dataDesaController.getDataDesaByJenis);
router.post('/', verifyTokenRequired, authorizeRoles(1, 2), dataDesaController.createDataDesa);
router.put('/:id', verifyTokenRequired, authorizeRoles(1, 2), dataDesaController.updateDataDesa);
router.delete('/:id', verifyTokenRequired, authorizeRoles(1, 2), dataDesaController.deleteDataDesa);

module.exports = router;
