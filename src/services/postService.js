const prisma = require('../config/db');

const createNewPost = async (postData, userId) => {
    return await prisma.post.create({
        data: {
            title: postData.title,
            description: postData.description,
            content: postData.content,
            visibility: postData.visibility || 'public',
            author: {
                connect: { id: userId }
            }
        }
    });
};

const getAllPosts = async () => {

    return await prisma.post.findMany({
        where: {
            state: 'Approved'
        },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    profilePic: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    dislikes: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });
};

const toggleLike = async (postId, userId) => {
    const existingDisLike = await prisma.postDislikes.findFirst({
        where: {
            postid: postId,
            userid: userId
        }
    });

    if (existingDisLike) {
        await prisma.postDislikes.delete({
            where: {
                id: existingDisLike.id
            }
        });
        return { message: "Dislike removed successfully" };
    }

    const existingLike = await prisma.postLikes.findFirst({
        where: {
            postid: postId,
            userid: userId
        }
    });

    if (existingLike) {
        await prisma.postLikes.delete({
            where: {
                id: existingLike.id
            }
        });
        return { message: "Like removed successfully" };
    } else {
        await prisma.postLikes.create({
            data: {
                postid: postId,
                userid: userId
            }
        });
        return { message: "Like added successfully" };
    }
};

const toggleDisLike = async (postId, userId) => {

    const existingLike = await prisma.postLikes.findFirst({
        where: {
            postid: postId,
            userid: userId
        }
    });

    if (existingLike) {
        await prisma.postLikes.delete({
            where: {
                id: existingLike.id
            }
        });
        return { message: "Like removed successfully" };
    }

    const existingDisLike = await prisma.postDislikes.findFirst({
        where: {
            postid: postId,
            userid: userId
        }
    });

    if (existingDisLike) {
        await prisma.postDislikes.delete({
            where: { id: existingDisLike.id }
        });
        return { message: "Dislike removed successfully" };
    } else {
        await prisma.postDislikes.create({
            data: {
                postid: postId,
                userid: userId
            }
        });
        return { message: "Post Disliked" };
    }
};

const getMyPosts = async (userId) => {
    return await prisma.post.findMany({
        where: {
            authorid: userId
        },
        include: {
            _count: {
                select: {
                    likes: true,
                    dislikes: true
                }
            }
        }
    });
};

const getPostById = async (postId) => {
    return await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: { select: { name: true, email: true, profilePic: true } },
            _count: { select: { likes: true, dislikes: true } }
        }
    });
};

const deletePost = async (postId, userId) => {
    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    if (post.authorid !== userId) {
        throw new Error("You are not authorized to delete this post");
    }

    await prisma.post.delete({
        where: { id: postId }
    });

    return {
        message: "Post deleted successfully"
    }
};

const getPopular = async () => {
    return await prisma.post.findMany({
        where: {
            state: 'Approved',
            visibility: 'public'
        },
        take: 10,
        include: {
            author: {
                select: { name: true }
            },
            _count: {
                select: {
                    likes: true,
                    dislikes: true
                }
            }
        },
        orderBy: {
            likes: {
                _count: 'desc'
            }
        }
    });
};

const updatePostState = async (postId, newState) => {
    const validStates = ['Approved', 'Pending', 'Rejected'];
    if (!validStates.includes(newState)) {
        throw new Error("Invalid State");
    }

    return await prisma.post.update({
        where: { id: postId },
        data: { state: newState }
    });
};

const getAllPostsForAdmin = async () => {
    return await prisma.post.findMany({
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            },
            _count: {
                select: {
                    likes: true,
                    dislikes: true
                }
            }
        },
        orderBy: {
            id: 'desc'
        }
    });
};

module.exports = { createNewPost, getAllPosts, toggleLike, toggleDisLike, getMyPosts, getPostById, deletePost, getPopular, updatePostState, getAllPostsForAdmin };