const User = require('../models/user')

module.exports.registerForm = (req, res) => {
    res.render('users/register')
}


module.exports.createUser = async (req, res) => {

    try {
        const { email, username, password } = req.body;

        // res.send(req.body)
        const user = new User({
            email, username
        });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }


}

module.exports.loginForm = (req,res) =>{
    res.render('users/login')
}

module.exports.login = async(req,res)=>{

    req.flash('success','You are logged in!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout =(req,res)=>{
    req.logout();
    req.flash('success','Logged Out!')
    res.redirect('/campgrounds');
}