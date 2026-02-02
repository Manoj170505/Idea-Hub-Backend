const { post } = require('../config/db');
const postService = require('../services/postService');

const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postData = req.body;
        const post = await postService.createNewPost(postData, userId);

        res.status(201).json({
            status: "success",
            message: "Post created successfully",
            data: post
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json({
            status: "success",
            message: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const getSinglePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postService.getPostById(postId);

        if (!post) {
            return res.status(404).json({
                status: "failed",
                message: "Post not found with this id"
            });
        }

        res.status(200).json({
            status: "success",
            data: post
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        await postService.deletePost(postId, userId);

        res.status(200).json({
            status: "success",
            message: "Post deleted successfully"
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
};

const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const result = await postService.toggleLike(postId, userId);

        res.status(200).json({
            status: "success",
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const result = await postService.toggleDisLike(postId, userId);

        res.status(200).json({
            status: "success",
            message: result.message
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const posts = await postService.getMyPosts(req.user.id);
        res.status(200).json({ status: "success", data: posts });
    } catch (error) {
        res.status(200).json({ status: "fail", message: error.message });
    }
};

const getPopular = async (req, res) => {
    try {
        const posts = await postService.getPopular();
        res.status(200).json({
            status: "success",
            message: "Popular posts fetched successfully",
            results: post.length,
            data: posts
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

const changePostState = async (req, res) => {
    try {
        const postId = req.params.id;
        const { state } = req.body;

        const updatedPost = await postService.updatePostState(postId, state);

        res.status(200).json({
            status: "success",
            message: `Post state updated successfully to ${state}`,
            data: updatedPost
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
}

const getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await postService.getAllPostsForAdmin();
        res.status(200).json({
            status: "success",
            message: "All posts fetched successfully",
            data: posts
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

module.exports = { createPost, getPosts, likePost, dislikePost, getUserPosts, getSinglePost, deletePost, getPopular, changePostState, getAllPostsAdmin };