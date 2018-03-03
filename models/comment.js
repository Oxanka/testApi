const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let commentSchema = new Schema({
    text: { type: Schema.Types.String },
    author: {type: Schema.Types.ObjectId, ref: 'User' },
    articleId: {type: Schema.Types.ObjectId, ref: 'Blog' },
    created: { type: Schema.Types.Date },
    status: { type: Schema.Types.String, default: 'active' },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    deleted: { type: Schema.Types.Boolean, default: false }

});

module.exports = mongoose.model('Comment', commentSchema);