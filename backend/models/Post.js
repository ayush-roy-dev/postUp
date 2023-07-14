const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    caption: {
        type: String,
        required: [true, "Please provide a post title"],
        maxlength: 200
    },
    image: {
        type: String,
        required: [true, "Please provide a post image url"],
        trim: true
    },
    likes: {
        type: Array,
        default: []
    },
    nbLikes: {
        type: Number,
        default: 0
    }
    
}, {timestamps: true})


module.exports = mongoose.model('Post', PostSchema)