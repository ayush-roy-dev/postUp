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
    value: {
        type: String,
        required: [true, "A coment cannot be empty"],
        maxlength: 150,
    }
}, {timestamps: true})

module.exports = mongoose.model('Coment', ComentSchema)