const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let blogSchema = new Schema({
    label: { type: Schema.Types.String },
    title: { type: Schema.Types.String },
    metaTitle: { type: Schema.Types.String },
    metaDescription: { type: Schema.Types.String },
    metaKeywords: [{ type: Schema.Types.String }],
    body: { type: Schema.Types.String },
    created: { type: Schema.Types.Date },
    status: { type: Schema.Types.String, default: 'new' },
    author: {type: Schema.Types.ObjectId, ref: 'User' },
    deleted: { type: Schema.Types.Boolean, default: false }

});

module.exports = mongoose.model('Blog', blogSchema);