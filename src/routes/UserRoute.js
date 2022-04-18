const express = require('express');
const router = new express.Router();

// Auth Middleware
const auth = require('../middleware/auth');

// Import From Controller
const UserController = require('../controllers/UserController');

// Create GenerateToken
router.post('/Registration', UserController.Registration);

// Login
router.post('/Login', auth, UserController.Login);

module.exports = router;