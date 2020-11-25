
//Imports
const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

//creates image schema 
const ImageSchema = new Schema({
    url: String,
    filename: String
});


//creates virtual properties of 'thumbnail ' for ImageSchema for future convinience 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

//converts the virtual properties to JSON data 
const opts = { toJSON: { virtuals: true } };

//Schema for Campground
const CampgroundSchema = new Schema({

    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true

        },
        coordinates: {
            type: [Number],
            required: true

        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);


//creates virtual properties for cluster map popups
CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {

    //if there is image sends back the 1st index image else returns "NO IMAGE FOUND"
    if (this.images.length) {

        return `<img src="${this.images[0].thumbnail}" style = "width:100%;">
        <a href="/campgrounds/${this._id}">${this.title}</a>
        <p>${this.description}</p>`
    } else {
        return `<img src="https://www.danob.com.bd/wp-content/uploads/2020/06/nophotofound.png" style = "width:100%;">
        <a href="/campgrounds/${this._id}">${this.title}</a>
        <p>${this.description}</p>`
    }
});

//deletes all reviews if campground is deleted
CampgroundSchema.post('findOneAndDelete', async (doc) => {

    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }

})

module.exports = mongoose.model('Campground', CampgroundSchema);

