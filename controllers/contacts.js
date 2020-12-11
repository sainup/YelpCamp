
//imports
const xss = require('xss')
const sgMail = require('@sendgrid/mail');

//mail api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//renders contact form
module.exports.renderContactForm = (req, res, next) => {
    res.render('contactForm')
}

//send mails
module.exports.sendContact = async (req, res, next) => {

    let { firstName, lastName, email, emailBody } = req.body;
  
    //santizes the input data
    firstName = xss(firstName);
    lastName = xss(lastName)
    email = xss(email);
    emailBody = xss(emailBody)

    //configures message body
    const msg = {
        to: process.env.EMAIL,
        from: (email),
        subject: (`${firstName} ${lastName}`),
        text: (emailBody),

    }

    //sends the message throws error if exists
    try {
        await sgMail.send(msg);
        req.flash('success', 'Email sent succesfully')
        res.redirect('/contact')
    } catch (err) {

        req.flash('error', 'Could not send!')
        if (error.response) {
            console.error(error.response.body)
        }
        res.redirect('/contact')
    }
}