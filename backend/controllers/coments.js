const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')
const Coment = require('../models/Coment')

const getAllComents = async (req, res) => {
    const coments = await Coment.find({postId: req.params.postId, isReply: false})
    if (!coments) return res.status(StatusCodes.OK).json({ msg: "No coments yet" })
    res.status(StatusCodes.OK).json({coments})
}

const createComent = async (req, res) => {
    const {
        body: { replyTo, value },
        params: {postId},
        user: {userId},
    } = req;
    const replies = await Coment.find({postId: req.params.postId, isReply: true}).select('_id')
    if (replies.includes({_id: replyTo})) throw new BadRequestError('Cannot reply to a reply')

    let newComent = { postId, value, userId }
    if (replyTo) {
        newComent.replyTo = replyTo
        newComent.isReply = true
    }
    const coment = await Coment.create(newComent)
    res.status(StatusCodes.CREATED).json({coment})
}

const getComent = async (req, res) => {
    const {
        params: {postId, comentId},
        user: {userId},
        query: {action},
    } = req;
    let coment = await Coment.findOne({_id: comentId, postId})
    if (!coment) throw new NotFoundError("Coment does not exist")
    if (action) {
        const alreadyLiked = coment.likes.includes(userId)
        if (action === 'like' && !alreadyLiked) {
            coment.likes.push(userId)
            coment.nbLikes++
            await coment.save()
            res.status(StatusCodes.OK)
        }
        else if (action === 'unlike' && alreadyLiked) {
            let index = coment.likes.indexOf(userId)
            coment.likes.splice(index, 1)
            coment.nbLikes--
            await coment.save()
            res.status(StatusCodes.OK)
        }
    }
    if (coment.isReply) throw new BadRequestError("The required coment is a reply")
    const replies = await Coment.find({isReply: true, replyTo: coment._id})
    let replyObject = {coment, replies}
    if (!replies) replyObject.replies = "No replies yet"
    res.status(StatusCodes.OK).json(replyObject)

}

const editComent = async (req, res) => {
    const {value} = req.body
    const coment = await Coment.findOneAndUpdate({_id: req.params.comentId, postId: req.params.postId, userId: req.user.userId}, {value}, {runValidators: true})
    if (!coment) throw new NotFoundError("Coment does not exist")
    res.status(StatusCodes.OK).json({coment: value.trim()})
}

const deleteComent = async (req, res) => {
    const {
        params: {comentId, postId},
        user: {userId},
    } = req;
    const coment = await Coment.findOneAndDelete({_id: comentId, postId, userId})
    if (!coment) throw new NotFoundError(`Coment not found`)
    res.status(StatusCodes.OK).json({msg: "Coment deleted succesfully"})
}

module.exports = { getAllComents, createComent, getComent, editComent, deleteComent }