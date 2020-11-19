
//Importing database modules
const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});



ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
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
    price: Number,
    description: String,
    location: String,
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
CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {

    if (this.images.length) {

        return `<img src=" ${this.images[0].thumbnail}" styles = "width : 100%;">
        <a href="/campgrounds/${this._id}">${this.title}</a>
        <p>${this.description}</p>

`
    } else {
        return `<img src=" "https://www.danob.com.bd/wp-content/uploads/2020/06/nophotofound.png" styles = "width : 100%;">
        <a href="/campgrounds/${this._id}">${this.title}</a>
        <p>${this.description}</p> `
    }

    
 });

 

CampgroundSchema.post('findOneAndDelete',async (doc) =>{

    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }

})

module.exports = mongoose.model('Campground',CampgroundSchema);

