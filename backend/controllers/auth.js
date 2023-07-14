const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors')
const User = require('../models/User')


const register = async (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    const user = await User.create(newUser)
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

const getUser = async (req, res) => {
    if (req.query.verify === 'email') {
        if (req.user.emailIsVerified) throw new BadRequestError("Email is already verified")
        // email verification functionality
        const user = await User.findOneAndUpdate({_id: req.user._id}, {emailIsVerified: true})
        res.status(StatusCodes.OK).json({msg: "Email verified succesfully"})
    }
    if (req.query.id) {
        const targetUser = await User.findById(req.query.id)
        if (!user) throw new BadRequestError('Please provide proper username')

        // follow unfollow functionality
        if (req.query.action) {
            if ((req.query.id === req.user.userId)) throw new BadRequestError("Unauthorized request")
            if (req.query.action === 'follow') {
                const currentUser = await User.findById(req.user.userId)
                currentUser.following.push(targetUser._id)
                targetUser.followers.push(req.user.userId)
                await currentUser.save()
                await targetUser.save()
                res.status(StatusCodes.OK).json({msg: `Started following ${targetUser.username}`}) 
            }

            else if (req.query.action === 'unfollow') {
                const currentUser = await User.findById(req.user.userId)
                currentUser.following = currentUser.following.filter((e) => {return !(e === targetUser._id)})
                targetUser.followers = targetUser.followers.filter((i) => {return !(i === currentUser._id)})
                await currentUser.save()
                await targetUser.save()
                res.status(StatusCodes.OK).json({msg: `Succesfully unfollowed ${targetUser.username}`})
            
            }
        }
        
        res.status(StatusCodes.OK).json({targetUser})
    }
    const user = await User.findById(req.user.userId)
    res.status(StatusCodes.OK).json({user})
    
}


const updateUser = async (req, res) => {
    const { username, email, bio } = req.body;
    const updatedUser = { username, email, bio }
    const user = await User.findOneAndUpdate({_id: req.user.userId}, updatedUser)
    res.status(StatusCodes.OK).json({user})
}


module.exports = { register, login, updateUser, getUser }