const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Coment = require('../models/Coment')

const getAllComents = async (req, res) => {
    const coments = Coment.find({postId: req.params.id, isReply: false})
    if (!coments) return res.status(StatusCodes.OK).json({ msg: "No coments yet" })
    res.status(StatusCodes.OK).json({coments})
}

const createComent = async (req, res) => {
    const { replyTo, value } = req.body;
    const replies = await Coment.find({postId: req.params.id, isReply: true}).select('_id')
    if (replies.includes({_id: replyTo})) throw new BadRequestError('Cannot reply to a reply')
    let newComent = {
        postId: req.params.id,
        value, 
        userId: req.user.userId
    }
    if (replyTo) {
        newComent.replyTo = replyTo
        newComent.isReply = true
    }
    const reply = await Coment.create(newComent)
    res.status(StatusCodes.CREATED).json({reply})
}

const getComent = async (req, res) => {
    const coment = await Coment.findOne({_id: req.params.comentId, postId: req.params.id, isReply: false})
    if (!coment) throw new NotFoundError("Coment does not exist or is a reply")
    const replies = await Coment.find({isReply: true, replyTo: coment._id})
    let replyObject = {coment, replies}
    if (!replies) replyObject.replies = "No replies yet"
    res.status(StatusCodes.OK).json(replyObject)

}

const editComent = async (req, res) => {
    const coment = await Coment.findOne({_id: req.params.comentId, postId: req.params.id, userId: req.user.userId})
    if (!coment) throw new NotFoundError("Coment does not exist")
    if (!req.body.value || req.body.value.trim() === '') throw new BadRequestError("A coment cannot be emply")
    coment.value = req.body.value;
    await coment.save({runValidators: true})
    res.status(StautsCodes.OK).json({msg: "Coment updated succesfully"})
}

const deleteComent = async (req, res) => {
    const coment = await Coment.findOneAndDelete({_id: req.params.comentId, postId: req.params.id, userId: req.params.userId})
    if (!coment) throw new NotFoundError("Please provide a proper coment id")
    res.status(StatusCodes.OK).json({msg: "Coment deleted cuccesfully"})
}

module.exports = { getAllComents, createComent, getComent, editComent, deleteComent }