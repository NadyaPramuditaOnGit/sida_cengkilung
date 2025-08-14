// routes/guestPenduduk/dataDesaRoutes.js
const express = require('express');
const router = express.Router();
const dataDesaController = require('../../controllers/guestPenduduk/dataDesaController');
const SSEService = require('../../services/sse');

// Endpoint API biasa
router.get('/', dataDesaController.getDataDesaByJenis);
router.get('/total', dataDesaController.getTotalDataDesaByJenis);

// Endpoint SSE untuk real-time Data Desa
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  SSEService.addClient('data-desa', res);

  // Kirim heartbeat tiap 25 detik
  const heartbeat = setInterval(() => {
    res.write('event: heartbeat\ndata: {}\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    SSEService.removeClient('data-desa', res);
  });
});

module.exports = router;
