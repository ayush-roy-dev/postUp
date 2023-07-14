const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require('../errors')
const Post = require('../models/Post')

const getAllPosts = async (req, res) => {
    const posts = await Post.find({}).select('-likes')
    res.status(StatusCodes.OK).json({posts})
}

const getPost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) throw new NotFoundError(`No post by id: ${req.params.id}`);

    // like unlike functionality
    if (req.query.action === "like") {
        const alreadyLiked = post.likes.includes(req.user.userId);
        if (!alreadyLiked) {
            post.likes.push(req.user.userId)
            post.nbLikes += 1
            await post.save()
        }
    }
    else if (req.query.action === "unlike") {
        const alreadyLiked = post.likes.includes(req.user.userId);
        if (alreadyLiked) {
            post.likes = post.likes.filter((e) => {return !(e === req.user.userId)})
            post.nbLikes -= 1
            await post.save()
        }
    }
    res.status(StatusCodes.OK).json({post})
}

const createPost = async (req, res) => {
    const { caption, image } = req.body;
    const post = await Post.create({caption, image, createdBy: req.user.userId});
    res.status(StatusCodes.CREATED).json({post})
}

const editPost = async (req, res) => {
    const { caption } = req.body;
    const post = await Post.findOneAndUpdate({_id: req.params.id, createdBy: req.user.userId}, { caption })
    if (!post) throw new NotFoundError(`No post by id: ${req.params.id}`);
    res.status(StatusCodes.OK).json({post})
}

const deletePost = async (req, res) => {
    const post = await Post.findOneAndDelete({_id: req.params.id, createdBy: req.user.userId})
    if (!post) throw new NotFoundError(`No post by id: ${req.params.id}`);
    res.status
}


module.exports = { getAllPosts, getPost, createPost, editPost, deletePost }