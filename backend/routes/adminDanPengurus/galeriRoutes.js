const express = require('express');
const router = express.Router();
const galeriController = require('../../controllers/adminDanPengurus/galeriController');
const galeriUpload = require('../../middleware/uploadGaleriMiddleware');
const { verifyTokenRequired, authorizeRoles } = require('../../middleware/authMiddleware');

// Middleware: hanya Admin (1) dan Pengurus (2)
const rolesAllowed = authorizeRoles(1, 2);

// Routes
router.get('/', verifyTokenRequired, rolesAllowed, galeriController.getGaleri);
router.get('/:id', verifyTokenRequired, rolesAllowed, galeriController.getGaleriById);
router.post('/', verifyTokenRequired, rolesAllowed, galeriUpload, galeriController.createGaleri);
router.put('/:id', verifyTokenRequired, rolesAllowed, galeriUpload, galeriController.updateGaleri);
router.delete('/:id', verifyTokenRequired, rolesAllowed, galeriController.deleteGaleri);

module.exports = router;