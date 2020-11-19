

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')


//configuring database
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected!!!")
})
    .catch(err => {
        console.log("ERROR")
        console.log(err);
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '5fae983cf7b1131c705c46cd',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry : {
                type : 'Point',
                coordinates : [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]

            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {

                    url: 'https://res.cloudinary.com/sainup/image/upload/v1605616088/YelpCamp/j9vz38nknrzugydukamr.jpg',
                    filename: 'YelpCamp/j9vz38nknrzugydukamr'
                },
                {

                    url: 'https://res.cloudinary.com/sainup/image/upload/v1605616088/YelpCamp/jjaqjldz5vsyp93rmvol.jpg',
                    filename: 'YelpCamp/jjaqjldz5vsyp93rmvol'
                },
                {

                    url: 'https://res.cloudinary.com/sainup/image/upload/v1605616089/YelpCamp/o9inrjdjzhxbsgibwpof.jpg',
                    filename: 'YelpCamp/o9inrjdjzhxbsgibwpof'
                },
            ],

            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio reprehenderit dolore modi at quidem provident rem, beatae vel quod odio velit perferendis magni, illo natus ullam molestiae sapiente? Cumque, ab?',
            price

        })

        
 

        await camp.save();
    }

}

seedDb().then(() => {
    mongoose.connection.close();
})