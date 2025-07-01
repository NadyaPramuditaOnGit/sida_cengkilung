const express = require('express');
const router = express.Router();
const agendaController = require('../../controllers/adminDanPengurus/agendaController');
const { verifyTokenRequired } = require('../../middleware/authMiddleware');
const { verifyAdmin } = require('../../middleware/peranMiddleware');
const upload = require('../../utils/uploadGambarAgenda');

// Semua endpoint diakses oleh Admin
router.get('/', verifyTokenRequired, verifyAdmin, agendaController.getAgendaList); // list + filter + pagination
router.get('/kalender', verifyTokenRequired, verifyAdmin, agendaController.getKalenderAgenda); // semua tanggal kegiatan
router.get('/:id', verifyTokenRequired, verifyAdmin, agendaController.getAgendaById); // detail by ID
router.post('/', verifyTokenRequired, verifyAdmin, upload.single('gambar'), agendaController.createAgenda); // tambah
router.put('/:id', verifyTokenRequired, verifyAdmin, upload.single('gambar'), agendaController.updateAgenda); // edit
router.delete('/:id', verifyTokenRequired, verifyAdmin, agendaController.deleteAgenda); // hapus

module.exports = router;
