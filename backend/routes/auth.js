const express = require('express');
const router = express.Router();
const { register, login, updateUser, verifyEmail } = require('../controllers/auth');
const authenticate = require('../middlewares/auth')


router.route('/login').post(login)
router.route('/register').post(register)
router.route('/verify-email').get(authenticate, verifyEmail)
router.route('/').patch(authenticate, updateUser)


module.exports = router;

