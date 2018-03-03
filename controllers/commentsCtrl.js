const Comment = require("../models/comment");

exports.create = (req, res) => {
    req.body.author = req.user._id;
    req.body.created = new Date();
    Comment.create(req.body)
        .then((newComment) => {
            newComment = newComment.toObject();
            delete newComment["deleted"];
            return res.status(200).json(newComment);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.getAll = (req, res) => {

    let queryParams = req.query;

    let cond = {};

    if(queryParams.hasOwnProperty('where') == true){
        cond.where = JSON.parse(queryParams.where)
    }
    cond.limit = queryParams.hasOwnProperty('limit') ? Number(queryParams.limit) : 10;

    cond.offset = queryParams.hasOwnProperty('offset') ?  Number(queryParams.offset) : 0;
    if(cond.where){
        cond.where.deleted = false;
    }
    else{
        cond.where = {'deleted': false}
    }

    if(queryParams.hasOwnProperty('order') == true){
        cond.order = JSON.parse(queryParams.order)
    }
    Comment.find(cond.where).skip(cond.offset).limit(cond.limit).sort(cond.order).select({"deleted": 0})
        .then((allComments) => {
            return res.status(200).json(allComments);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.getOne = (req, res) => {
    // Comment.findById(req.param('id')).populate(['author','articleId', 'parentId']).where({deleted: false}).select({"deleted": 0})
    Comment.findById(req.param('id')).where({deleted: false}).select({"deleted": 0})
        .then((oneComment) => {
            if(oneComment){
                return res.status(200).json(oneComment);
            }
            else{
                return res.status(404).json({msg: "Comment not found"});
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.count = (req, res) => {

    let queryParams = req.query;
    let cond = {};
    if(queryParams.hasOwnProperty('where') == true){
        cond.where = JSON.parse(queryParams.where)
    }
    cond.offset = queryParams.hasOwnProperty('offset') ?  Number(queryParams.offset) : 0;

    if(queryParams.hasOwnProperty('order') == true){
        cond.order = JSON.parse(queryParams.order)
    }
    if(cond.where){
        cond.where.deleted = false;
    }
    else{
        cond.where = {'deleted': false}
    }

    Comment.find(cond.where).skip(cond.offset).sort(cond.order).count()
        .then((countComments) => {
            return res.status(200).json({ count: countComments });
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.updateOne = (req, res) => {
    Comment.findByIdAndUpdate(req.param('id'), req.body, {new: true}).where({deleted: false}).select({"deleted": 0})
        .then((oneComment) => {
            if(oneComment){
                return res.status(200).json(oneComment);
            }
            else{
                return res.status(404).json({msg: "Comment not found"});
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.deleteOne = (req, res) => {

    Comment.findByIdAndUpdate(req.param('id'), {deleted: true, status: 'deleted'}, {new: true}).where({deleted: false}).select({"deleted": 0})
        .then((oneComment) => {
            if(oneComment){
                return res.status(200).json(oneComment);
            }
            else{
                return res.status(404).json({msg: "Comment not found"});
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};