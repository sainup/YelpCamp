
const xss = require('xss')
const sgMail = require('@sendgrid/mail');
const { text } = require('express');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY)

const textyy = xss('<script>alert("xss");</script>');
console.log('TEXTYYYYYYYYYYYYYYYYYYY', textyy)

module.exports.renderContactForm = (req, res, next) => {
    res.render('contactForm')
}

module.exports.sendContact = async (req, res, next) => {

    let { firstName, lastName, email, emailBody } = req.body;
    console.log(firstName, lastName, email)
    firstName = xss(firstName);
    lastName = xss(lastName)
    email = xss(email);
    emailBody = xss(emailBody)
    const msg = {
        to: process.env.EMAIL,
        from: (email),
        subject: (`${firstName} ${lastName}`),
        text: (emailBody),

    }

    try {
        await sgMail.send(msg);
        req.flash('success', 'Email sent succesfully')
        console.log("EMAILLLLLLLLLLLLLLLLLLLLL >>>>>>>>>>>>>>>>>>>>>", emailBody)
        res.redirect('/contact')
    } catch (err) {
        req.flash('error', 'Could not send!')
        console.log('not sent', err)
        if (error.response) {
            console.error(error.response.body)
        }
        res.redirect('/contact')

    }
}