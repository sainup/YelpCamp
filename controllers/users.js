//imports
const User = require('../models/user')


//renders registration form
module.exports.registerForm = (req, res) => {res.render('users/register')}

//creates user
module.exports.createUser = async (req, res) => {

    try {
        const { email, username, password } = req.body;


        const user = new User({
            email, username
        });

        //registers the user
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);

        //logs the user in after registering. Throws error if any occurs.
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }


}

//renders login form
module.exports.loginForm = (req, res) => {res.render('users/login')}

//logs the user in
module.exports.login = async (req, res) => {

    req.flash('success', 'You are logged in!')
    //returns to the same page where authorization was required after loggin in 
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

//logs the user out
module.exports.logout = (req, res) => {

    req.logout();
    req.flash('success', 'Logged Out!')
    res.redirect('/campgrounds');
}