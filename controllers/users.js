//imports
const User = require('../models/user')


//renders registration form
module.exports.registerForm = (req, res) => { res.render('users/register') }

//creates user
module.exports.createUser = async (req, res) => {

    try {
        const { email, username, password, firstName, lastName } = req.body;


        const user = new User({
            email, username, firstName, lastName
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
module.exports.loginForm = (req, res) => { res.render('users/login') }

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

//renders account form
module.exports.accountForm = (req, res) => { res.render('users/accounts') }


//finds user by id and updates the detail if succesful else throws error
module.exports.patchAccount = async (req, res) => {
    try {
        const { firstName, lastName, username } = req.body

        //finds the user by id and updates the details
        const user = await User.findByIdAndUpdate(req.user._id, { firstName, lastName, username })
        req.login(user, err => {
            if (err) return next(err);
            req.flash('success', "Account updated")
            res.redirect('/accounts')
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/accounts')
    }

}

//changes passwords
module.exports.changePassword = async (req, res) => {

    const { newPassword, password } = req.body

    //finds user by id
    const user = await User.findById(req.user._id);

    //changes password if user exist else throws error
    await user.changePassword(password, newPassword, (err) => {

        if (err) {
            console.log(err);
            req.flash('error', 'Incorrect password');
            return res.redirect('/accounts')
        };
        if (password === newPassword) {
            req.flash('error', 'New password can not be same as old password!');
            return res.redirect('/accounts')
        }
        res.redirect('/campgrounds')
    })

}

