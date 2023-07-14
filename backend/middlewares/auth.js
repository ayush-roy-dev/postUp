const { UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const authenticate = async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) throw new UnauthenticatedError("Authorization is required to access this route")
    const token = authorization.split(" ")[1]
    if (!token) throw new UnauthenticatedError("Authorization is required to access this route")
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: payload.userId }).select("-password")
        if (!user) throw new UnauthenticatedError("Authorization is required to access this route")
        req.user = {userId: user._id, username: user.username, following: user.following}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authorization is required to access this route")
    }
    
}

module.exports = authenticate;