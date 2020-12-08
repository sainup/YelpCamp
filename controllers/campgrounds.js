
//imports
const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
console.log(mapBoxToken)
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });


//finds and renders  all campgrounds
module.exports.index = async (req, res) => {
    let {search,scrollCount} = req.query
    console.log(req.query)
  
    let campgrounds = await Campground.find({}).limit(50);
     console.log("SEARCHHHHHHHHHHHHH",search)
    if(search){
        
            campgrounds = await Campground.find({'title' : {$regex : new RegExp(search,"i")}});
            console.log("hello world");
            if(!campgrounds.length){
                console.log("Not found",campgrounds)
                req.flash('error',"Can not find any campgrounds.")
                res.redirect('/campgrounds')
            }
            return res.render('campgrounds/index', { campgrounds});
       
       
    }else{
       return res.render('campgrounds/index', {campgrounds})
    }
  

    
};

//renders form for adding campground
module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}


//creates campground
module.exports.createCampground = async (req, res, next) => {

    //takes the location and converts it to geoCodes
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    console.log(geoData.body.features)

    const campground = new Campground(req.body.campground);

    //saves the location's co-ordinates and TYPE ['Point']
    campground.geometry = geoData.body.features[0].geometry;

    //saves the image URL and Filename 
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))

    campground.author = req.user._id;
    //saves the campground to db
    await campground.save();

    console.log(req.files.map(f => ({ url: f.path, filename: f.filename })))
    console.log(campground)

    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground.id}`);

}

//shows campgrounds
module.exports.showCampground = async (req, res) => {

    const { id } = req.params;

    //finds campground and populates with the data of who created and the who wrote the review
    const campground = await Campground.findById(id)
    .populate('author')
    .populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });

    //sends error if campground doesn't exists and redirects
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    console.log(campground)
    res.render('campgrounds/show', { campground })
}

//renders form where user can edit the campground
module.exports.editForm = async (req, res) => {

    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

//updates the data given by the user
module.exports.editCampground = async (req, res, next) => {

    const { id } = req.params;
    console.log(req.body);
    //finds campground and updates
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    //converts location to geoCodes and saves the co-ordinates to campground
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry;

    //saves the URL and FILENAME of the image and saves it campground
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log(req.files.map(f => ({ url: f.path, filename: f.filename })))
    campground.images.push(...imgs);

    //saves campground at the end
    await campground.save();

    //deletes images
    if (req.body.deleteImages) {
        //loops over the selected images to be deleted
        for (let filename of req.body.deleteImages) {
            //deletes the image
            await cloudinary.uploader.destroy(filename);
        }
        //deletes the image out of campground
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground)
    }

    req.flash('success', 'Successfully updated the campground');
    res.redirect(`/campgrounds/${campground.id}`)
}

//deletes the campground
module.exports.deleteCampground = async (req, res) => {

    //finds and deletes the campground
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground.');
    res.redirect(`/campgrounds`)
}