const express = require('express');
const router = express.Router();

const { 
  getDataDesaByJenis,
  createDataDesa,
  updateDataDesa,
  deleteDataDesa
} = require('../../controllers/adminDanPengurus/dataDesaController');

const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');

// GET /adminDanPengurus/data-desa?jenis=Kependudukan
router.get('/', verifyTokenRequired, authorizeRoles(1, 2), getDataDesaByJenis);

// POST /adminDanPengurus/data-desa
router.post('/', verifyTokenRequired, authorizeRoles(1, 2), createDataDesa);

// PUT /adminDanPengurus/data-desa/:id
router.put('/:id', verifyTokenRequired, authorizeRoles(1, 2), updateDataDesa);

// DELETE /adminDanPengurus/data-desa/:id
router.delete('/:id', verifyTokenRequired, authorizeRoles(1, 2), deleteDataDesa);

module.exports = router;
