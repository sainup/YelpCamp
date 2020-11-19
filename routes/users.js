

const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campgrounds');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.createUser))


router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.login))


router.get('/logout', (users.logout))

module.exports = router;