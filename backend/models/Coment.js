const mongoose = require('mongoose')

const ComentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "A post id is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "A user id is required"]
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coment',
    },
    isReply: {
        type: Boolean,
        default: false
    },
    value: {
        type: String,
        required: [true, "A coment cannot be empty"],
        maxlength: 150,
    },
    nbLikes: {
        type: Number,
        default: 0,
    }
}, {timestamps: true})

module.exports = mongoose.model('Coment', ComentSchema)