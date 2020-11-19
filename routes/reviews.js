
//importing modules
const express = require('express')
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const { populate } = require('../models/review');
const reviews =require('../controllers/reviews')



//defining routes

//POST route for reviews
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))


//DELETE route for reviews
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

//exporting the module
module.exports = router;