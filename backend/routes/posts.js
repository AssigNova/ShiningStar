const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostsByCategory,
  getPostsByUser,
  updatePost,
  deletePost
} = require('../controllers/postController');

// CRUD routes
router.post('/', createPost);
router.get('/', getPosts);
router.get('/category/:category', getPostsByCategory);
router.get('/user/:userId', getPostsByUser);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Like/Unlike/Comment routes
router.post('/:id/like', require('../controllers/postController').likePost);
router.post('/:id/unlike', require('../controllers/postController').unlikePost);
router.post('/:id/comment', require('../controllers/postController').addComment);

module.exports = router;
