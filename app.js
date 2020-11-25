

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.NODE_ENV)




//Importing modules
const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const app = express();
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
const MongoDBStore = require('connect-mongo')(session);
const { connectSrcUrls, scriptSrcUrls, styleSrcUrls, fontSrcUrls } = require('./helmetConfig')
const secret = process.env.SECRET || 'thisshouldbeabettersecret';
// const dbUrl = process.env.DB_URL



//configuring database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connected!!!")
})
    .catch(err => {
        console.log("ERROR")
        console.log(err);
    })



//Using app configuration
//for urlencoded inputs
app.use(express.urlencoded({ extended: true }))
//for PUT , PATCH  and DELETE method to work on form
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
//helps securing by setting various HTTP headers
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/sainup/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//santizes inputs against query selector injections
app.use(mongoSanitize({
    replaceWith: '_'
}))


//Setting session to be stored in mongoDB
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log("SESSION STORE ERROR")
})

//session config
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 2,
        maxAge: 1000 * 60 * 60 * 2
    }
}

//session
app.use(session(sessionConfig))

//flash
app.use(flash());

//Configuring passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Setting app configurations
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.danger = req.flash('danger');
    res.locals.error = req.flash('error');
    next();
})

//defining routes
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)
app.use('/', userRoutes)


//index route
app.get('/', (req, res) => {
    res.render('home')
})



//Error Handling routes
app.all('*', (req, res, next) => {
    next(new ExpressErorr('Page Not Found', 404))
})
app.use((err, req, res, next) => {

    const { statusCode = 500 } = err;

    if (!err.message) { err.message = "Something went wrong!" }
    res.status(statusCode).render('error', { err })
})


//configuring port for server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log("Serviing on port " + port)
})

