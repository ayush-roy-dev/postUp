const express = require('express');
const router = express.Router();
const { getAllPosts, getPost, createPost, editPost, deletePost } = require('../controllers/posts');
const authenticate = require('../middlewares/auth')


router.route('/').get(getAllPosts).post(authenticate, createPost)
router.route('/:id').get(authenticate, getPost).patch(authenticate, editPost).delete(authenticate, deletePost)

module.exports = router;

