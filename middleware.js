
//imports
const Campground = require('./models/campground')
const ExpressErorr = require('./utils/ExpressError')
const { campgroundSchema , reviewSchema} = require('./schemas')
const Review = require('./models/review')

//checks if user is logged in or not 
module.exports.isLoggedIn = (req,res,next) =>{

    console.log('REQ.USER .... ', req.user);
    //if not authenticated flashes error message and redirects to log in page
    if(!req.isAuthenticated()){
        console.log(req.path,req.originalUrl)
        req.session.returnTo = req.originalUrl;
        req.flash('error',"You must be signed in first!")
       return res.redirect('/login')
    }

    next();

}


//validates campgrounds data
module.exports.validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);

    //throws error if any
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400);
    } else {
        next();
    }
}

//checks if it is the creator or not
module.exports.isAuthor = async ( req,res,next) =>{
    const { id } = req.params
    const campground = await Campground.findById(id);
    //flashes error message and redirects to show page
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

//checks if its the one who wrote the review or not
module.exports.isReviewAuthor = async ( req,res,next) =>{
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    //flashes error message and redirects to showpage
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}





//validating review data
module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400);
    } else {
        next();
    }
}
