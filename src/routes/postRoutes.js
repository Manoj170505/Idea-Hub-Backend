const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.post("/create", protect, postController.createPost);
router.get("/popular", postController.getPopular);
router.get('/my-posts', protect, postController.getUserPosts);
router.get("/all", postController.getPosts);
router.get("/admin/all-posts", protect, isAdmin, postController.getAllPostsAdmin);
router.get("/:id", postController.getSinglePost);
router.patch("/like/:id", protect, postController.likePost);
router.patch("/dislike/:id", protect, postController.dislikePost);
router.delete("/:id", protect, postController.deletePost);
router.patch("/admin/update-state/:id", protect, isAdmin, postController.changePostState);

module.exports = router;