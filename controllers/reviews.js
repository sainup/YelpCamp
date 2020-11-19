const Review = require('../models/review')
const Campground = require('../models/campground')
module.exports.createReview = async (req, res, next) => {

    const { id } = req.params
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review)

    console.log(review.populate('author'))
    console.log(campground.populate('reviews'))
    await review.save();
    await campground.save();

 
    req.flash('success','Review was added.');
    res.redirect(`/campgrounds/${campground.id}`);

}

module.exports.deleteReview = async (req, res, next) => {

    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review was deleted!');
    res.redirect(`/campgrounds/${id}`);
}