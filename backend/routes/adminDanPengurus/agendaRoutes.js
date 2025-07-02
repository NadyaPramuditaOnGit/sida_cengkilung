const express = require('express');
const router = express.Router();
const agendaController = require('../../controllers/adminDanPengurus/agendaController');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');
const upload = require('../../utils/uploadGambarAgenda');

// Semua endpoint bisa diakses oleh Admin (1) dan Pengurus (2)
router.get('/', verifyTokenRequired, authorizeRoles(1, 2), agendaController.getAgendaList);
router.get('/kalender', verifyTokenRequired, authorizeRoles(1, 2), agendaController.getKalenderAgenda);
router.get('/:id', verifyTokenRequired, authorizeRoles(1, 2), agendaController.getAgendaById);
router.post('/', verifyTokenRequired, authorizeRoles(1, 2), upload.single('gambar'), agendaController.createAgenda);
router.put('/:id', verifyTokenRequired, authorizeRoles(1, 2), upload.single('gambar'), agendaController.updateAgenda);
router.delete('/:id', verifyTokenRequired, authorizeRoles(1, 2), agendaController.deleteAgenda);

module.exports = router;
