const express = require('express');
const router = new express.Router();

// Auth Middleware
const auth = require('../middleware/auth');

// Multer Middleware
const upload = require('../middleware/multer');

// Import From Controller
const PostController = require('../controllers/PostController');

// Create Post
router.post('/CreatePost', [auth, upload.array('image')], PostController.CreatePost);

// Update Post
router.patch('/UpdatePost/:id', auth, PostController.UpdatePost);

// Delete Post
router.delete('/DeletePost/:id', auth, PostController.DeletePost);

// Get All Post
router.get('/GetAllPost', auth, PostController.GetAllPost);

// Get Post By Topic
router.get('/GetPostByTopic/:topicid', auth, PostController.GetPostByTopic);

// Get Recent Post
router.get('/GetRecentPost', auth, PostController.GetRecentPost);

// Get Most Liked Post
router.get('/GetMostLikedPost', auth, PostController.GetMostLikedPost);

// Like Post
router.patch('/LikePost', auth, PostController.LikePost);

// DisLike Post
router.patch('/DisLikePost', auth, PostController.DisLikePost);

// Add Post Comment
router.patch('/AddPostComment', auth, PostController.AddPostComment);

module.exports = router;