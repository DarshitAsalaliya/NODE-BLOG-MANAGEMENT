const express = require('express');
const router = new express.Router();

// Import From Controller
const UserController = require('../controllers/UserController');

// Create GenerateToken
router.post('/Registration', UserController.Registration);

module.exports = router;