const express = require('express');
const router = express.Router();
const sejarahController = require('../../controllers/guestPenduduk/sejarahController');
const { verifyTokenOptional } = require('../../middleware/authMiddleware');


router.get('/sejarah', sejarahController.getSejarahTerbaru);
router.get('/sejarah/galeri', sejarahController.getDokumentasiSejarah);


module.exports = router;
