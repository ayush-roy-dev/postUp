const express = require('express');
const router = express.Router();
const { getAllPosts, getPost, createPost, editPost, deletePost } = require('../controllers/posts');
const { getAllComents, createComent, getComent, editComent, deleteComent } = require('../controllers/coments')
const authenticate = require('../middlewares/auth')


router.route('/').get(getAllPosts).post(authenticate, createPost)
router.route('/:id').get(authenticate, getPost).patch(authenticate, editPost).delete(authenticate, deletePost)
router.route('/:id/coments').get(getAllComents).post(authenticate, createComent)
router.route('/:id/coments/:comentId').get(getComent).patch(authenticate, editComent).delete(authenticate, deleteComent)

module.exports = router;

