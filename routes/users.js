
//imports
const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')


//get and post routes for register
router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.createUser))

//get and post routes for login
router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.login))

//get route for logout
router.get('/logout', (users.logout))

module.exports = router;