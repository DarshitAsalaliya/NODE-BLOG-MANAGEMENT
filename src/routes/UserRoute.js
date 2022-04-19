const express = require('express');
const router = new express.Router();

// Auth Middleware
const auth = require('../middleware/auth');

// Multer Middleware
const upload = require('../middleware/multer');

// Import From Controller
const UserController = require('../controllers/UserController');

// Create GenerateToken
router.post('/Registration', upload.single('image'), UserController.Registration);

// Login
router.post('/Login', UserController.Login);

module.exports = router;