const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyTokenRequired } = require('../middleware/authMiddleware');
const { getCurrentUser } = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/select-role', authController.selectRole);
router.post('/request-change-password', authController.requestChangePassword);
router.post('/change-password-via-email', authController.changePasswordViaEmail);
router.get('/me', verifyTokenRequired, getCurrentUser);

module.exports = router;
