
//imports
const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

//routes for campgrounds

//get and post routes for campgrounds
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

//routes to new campground form 
router.get('/new', isLoggedIn, campgrounds.newForm)

//findOne, edit and delete route
router.route('/:id')

    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

//render form for edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))

module.exports = router;