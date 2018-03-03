const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    passportLocalMongoose = require('passport-local-mongoose');

let tokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    created: { type: Date, default: Date.now() },
    lastUsed: { type: Date },
    hash: { type: String, required: true }
});


module.exports = mongoose.model('Token', tokenSchema);