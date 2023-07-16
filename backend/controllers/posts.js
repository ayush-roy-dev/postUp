const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require('../errors')
const Post = require('../models/Post')

const getAllPosts = async (req, res) => {
    const posts = await Post.find({}).select('-likes')
    res.status(StatusCodes.OK).json({posts})
}

const getPost = async (req, res) => {
    const post = await Post.findById(req.params.postId)
    if (!post) throw new NotFoundError(`No post by id: ${req.params.postId}`);

    // like unlike functionality
    if (req.query.action === "like") {
        const alreadyLiked = post.likes.includes(req.user.userId);
        if (!alreadyLiked) {
            post.likes.push(req.user.userId)
            post.nbLikes++
            await post.save()
        }
    }
    else if (req.query.action === "unlike") {
        const alreadyLiked = post.likes.includes(req.user.userId);
        if (alreadyLiked) {
            let index = post.likes.indexOf(req.user.userId)
            post.likes.splice(index, 1)
            post.nbLikes--
            await post.save()
        }
    }
    res.status(StatusCodes.OK).json({post})
}

const createPost = async (req, res) => {
    const { caption, image, title } = req.body;
    const post = await Post.create({caption, title, image, createdBy: req.user.userId});
    res.status(StatusCodes.CREATED).json({post})
}

const editPost = async (req, res) => {
    const { caption, title } = req.body;
    const post = await Post.findOneAndUpdate({_id: req.params.postId, createdBy: req.user.userId}, { caption, title }, {runValidators: true})
    if (!post) throw new NotFoundError(`No post by id: ${req.params.postId}`);
    res.status(StatusCodes.OK).json({post})
}

const deletePost = async (req, res) => {
    const post = await Post.findOneAndDelete({_id: req.params.postId, createdBy: req.user.userId})
    if (!post) throw new NotFoundError(`No post by id: ${req.params.postId}`);
    res.status(StatusCodes.OK).json({msg: "Post deleted succesfully"})
}


module.exports = { getAllPosts, getPost, createPost, editPost, deletePost }