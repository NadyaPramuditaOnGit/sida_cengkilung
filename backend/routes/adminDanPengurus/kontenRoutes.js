const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/adminDanPengurus/kontenController');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadThumbKonten');

router.use(verifyTokenRequired, authorizeRoles(1,2)); // Admin=1, Pengurus=2

router.get('/', ctrl.getKonten);
router.get('/:id', ctrl.getKontenById);
router.post('/', upload.single('thumbnail'), ctrl.createKonten);
router.put('/:id', upload.single('thumbnail'), ctrl.updateKonten);
router.delete('/:id', ctrl.deleteKonten);

module.exports = router;