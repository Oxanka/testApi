const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

const map = require('../config/map');

let userSchema = new Schema({
    email: { type: String, required: true },
    fname: { type: String },
    lname: { type: String },
    role: { type: Number, default: map.ROLES.USER }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);