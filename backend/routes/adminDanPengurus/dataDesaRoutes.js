const express = require('express');
const router = express.Router();
const dataDesaController = require('../../controllers/adminDanPengurus/dataDesaController');
const { verifyTokenRequired } = require('../../middleware/authMiddleware');
const { verifyAdmin } = require('../../middleware/peranMiddleware');

// Semua route dilindungi untuk Admin
router.get('/', verifyTokenRequired, verifyAdmin, dataDesaController.getDataDesaByJenis);
router.post('/', verifyTokenRequired, verifyAdmin, dataDesaController.createDataDesa);
router.put('/:id', verifyTokenRequired, verifyAdmin, dataDesaController.updateDataDesa);
router.delete('/:id', verifyTokenRequired, verifyAdmin, dataDesaController.deleteDataDesa);

module.exports = router;
