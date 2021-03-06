
//imports
const express = require('express')
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateReview, isReviewAuthor, isAuthor } = require('../middleware');
const reviews =require('../controllers/reviews')



//defining routes

//POST route for reviews
router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))


//DELETE route for reviews
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

router.put('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.editReview))

//exporting the module
module.exports = router;