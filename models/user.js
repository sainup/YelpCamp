//imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//Schema for Users
//username, password,salt and hash field is added by passport
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
//plugin passport for UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema)