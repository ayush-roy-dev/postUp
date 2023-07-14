const express = require('express');
const router = express.Router();
const { register, login, updateUser, getUser } = require('../controllers/auth');
const authenticate = require('../middlewares/auth')


router.route('/login').post(login)
router.route('/register').post(register)
router.route('/').patch(authenticate, updateUser).get(authenticate, getUser)


module.exports = router;

