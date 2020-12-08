const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const contact = require('../controllers/contacts')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

router.route('/contact')
.get(contact.renderContactForm)
.post(contact.sendContact);


module.exports = router;