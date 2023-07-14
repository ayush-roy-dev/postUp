const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors')
const User = require('../models/User')


const register = async (req, res) => {
    const user = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({user: {userId: user._id, username: user.username} ,token: user.createJWT() })
}

const login = async (req, res) => {
    const { username, email, password } = req.body;
    if ((!email && !username) || !password) throw new BadRequestError("Please provide proper username and password")

    if (username) {
        const user = await User.findOne({ username })
        if (!user) throw new BadRequestError('Please provide proper username and password')
        const isValid = await user.comparePassword(password)
        if (!isValid) throw new BadRequestError('Please provide proper username and password')
        res.status(StatusCodes.OK).json({user: {userId: user._id, username: user.username} ,token: user.createJWT() })
    }
    if (email) {
        const user = await User.find({ email })
        if (!user) throw new BadRequestError('Please provide proper username and password')
        const isValid = await user.comparePassword(password)
        if (!isValid) throw new BadRequestError('Please provide proper username and password')
        res.status(StatusCodes.OK).json({user: {userId: user._id, username: user.username} ,token: user.createJWT() })
    }
}

const verifyEmail = async (req, res) => {
    if (req.user.emailIsVerified) throw new BadRequestError("Email is already verified")
    // email verification functionality
    const user = await User.findOneAndUpdate({_id: req.user._id}, {emailIsVerified: true})
    res.status(StatusCodes.OK).json({msg: "Email verified succesfully"})
}


const updateUser = async (req, res) => {
    const user = await User.findOne({_id: req.user._id}, req.body)
}

module.exports = { register, login, updateUser, verifyEmail }