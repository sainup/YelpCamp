
//imports
const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')


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

router.route('/changePassword')
    .post(isLoggedIn,catchAsync(users.changePassword))


router.route('/accounts')
    .get(isLoggedIn,users.accountForm)
    .patch(isLoggedIn,users.patchAccount)


module.exports = router;