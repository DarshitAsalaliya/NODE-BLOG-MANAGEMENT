const express = require('express');
const router = new express.Router();

// Auth Middleware
const auth = require('../middleware/auth');

// Import From Controller
const TopicController = require('../controllers/TopicController');

// Create Topic
router.post('/CreateTopic', auth, TopicController.CreateTopic);

// Get All Topic
router.get('/GetAllTopic', auth, TopicController.GetAllTopic);

module.exports = router;