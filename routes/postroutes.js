const express = require('express');
const router = express.Router();
const { createPost, fetchPosts, fetchPost, updatePost, updateValidations, updateImage, deletePost, home, postDetails, postComment, likePost, unlikePost, getAllPost } = require("../controllers/postController");
const auth = require('../utils/auth.js');

router.post('/create_post', auth, createPost);
router.post('/update', [auth, updateValidations], updatePost);
router.post('/updateImage', auth, updateImage);
router.get('/delete/:id', auth, deletePost);
router.get('/posts/:id/:page', auth, fetchPosts);
router.get('/post/:id', auth, fetchPost);
router.get('/home/:page', home);
router.get('/details/:id', postDetails);
router.post('/comment', auth, postComment);
router.get('/getAll', getAllPost);
router.put('/like', auth, likePost);
router.put('/unlike', auth, unlikePost);

module.exports = router;