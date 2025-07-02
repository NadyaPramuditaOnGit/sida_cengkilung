// routes/agendaRoutes.js

const express = require('express');
const router = express.Router();
const agendaController = require('../../controllers/guestPenduduk/agendaController');
const { verifyTokenOptional } = require('../../middleware/authMiddleware');

// GET /api/agenda/bulan?year=2025&month=6
router.get('/bulan', verifyTokenOptional, agendaController.getAgendaDatesByMonth);

// GET /api/agenda/tanggal?date=2025-06-18
router.get('/tanggal', verifyTokenOptional, agendaController.getAgendaByDate);

module.exports = router;
