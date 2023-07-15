const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors')
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
    // email verification functionality
    if (req.query.action === 'verify-email') {
        if (req.user.emailIsVerified === true) throw new BadRequestError("Email is already verified")
        // email verification functionality
        await User.findOneAndUpdate({_id: req.user.userId}, {emailIsVerified: true}, {runValidators: true})
        res.status(StatusCodes.OK).json({msg: "Email has been verified"})

    }
    else if (req.query.id) {
        const targetUser = await User.findById(req.query.id)
        if (!targetUser) throw new NotFoundError('Please provide proper username')
        
        // follow unfollow functionality
        if (req.query.action == 'follow' || req.query.action == 'unfollow') {

            if ((req.query.id === req.user.userId)) throw new BadRequestError("Unauthorized request")

            const currentUser = await User.findById(req.user.userId)
            const alreadyFollowed = targetUser.followers.includes(currentUser._id)
            if (req.query.action === 'follow') {
                if(alreadyFollowed) res.status(StatusCodes.OK).json({msg: `Already following ${targetUser.username}`})
                currentUser.following.push(targetUser._id)
                targetUser.followers.push(req.user.userId)
                
                await currentUser.save()
                await targetUser.save()

                res.status(StatusCodes.OK).json({msg: `Started following ${targetUser.username}`}) 
            }

            else if (req.query.action === 'unfollow') {
                if(!alreadyFollowed) res.status(StatusCodes.OK).json({msg: `Not already following ${targetUser.username}`})
                let index1 = currentUser.following.indexOf(targetUser._id)
                currentUser.following.splice(index1, 1)
                let index2 = targetUser.followers.indexOf(currentUser._id)
                targetUser.followers.splice(index2, 1)
                await currentUser.save()
                await targetUser.save()
                res.status(StatusCodes.OK).json({msg: `Succesfully unfollowed ${targetUser.username}`})
            
            }
        }
        const user = {...targetUser}
        user.password = undefined;
        res.status(StatusCodes.OK).json({user})
    } else {
        const user = await User.findById(req.user.userId).select("-password")
        res.status(StatusCodes.OK).json({user})
    }
    
}


const updateUser = async (req, res) => {
    const { username, email, bio } = req.body;
    if (!username && !email && !bio) throw new BadRequestError('Please provide proper update parameters')
    const updatedUser = { username, email, bio }
    const user = await User.findOneAndUpdate({_id: req.user.userId}, updatedUser, {runValidators: true})
    res.status(StatusCodes.OK).json({msg: 'User updated succesfully'})
}


module.exports = { register, login, updateUser, getUser }