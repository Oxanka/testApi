const Blog = require("../models/blog");
const User = require("../models/user");
const _ = require('lodash');

exports.create = (req, res) => {
    req.body.author = req.user._id;
    req.body.created = new Date();
    req.body.body = _.escape(req.body.body);
    Blog.create(req.body)
        .then((newBlog) => {
            getAuthorBlog(newBlog.author)
                .then(user => {
                    newBlog = newBlog.toObject();
                    newBlog.authorName = user.fname +" "+ user.lname;
                    newBlog.author = user.fname +" "+ user.lname;
                    newBlog.body =_.unescape(newBlog.body);
                    delete newBlog["deleted"];
                    return res.status(200).json(newBlog);
                })
                .catch((error) => {
                    return res.status(500).json({ error: error.message });
                })
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
        cond.where = {"deleted": false}
    }

    if(queryParams.hasOwnProperty('order') == true){
        cond.order = JSON.parse(queryParams.order)
    }
    Blog.find(cond.where).skip(cond.offset).limit(cond.limit).sort(cond.order).populate("author").select({"deleted": 0})
        .then((allBlogs) => {
        for(let i=0; i< allBlogs.length; i++){
            allBlogs[i] = allBlogs[i].toObject();
            allBlogs[i].authorName = allBlogs[i].author.fname +" "+ allBlogs[i].author.lname;
            allBlogs[i].body =_.unescape(allBlogs[i].body);
            allBlogs[i].author = allBlogs[i].author.fname +" "+ allBlogs[i].author.lname;
        }
            return res.status(200).json(allBlogs);
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.getOne = (req, res) => {

    Blog.findById(req.param("id")).populate("author").where({deleted: false}).select({"deleted": 0})
        .then((oneBlog) => {
        if(oneBlog){
            oneBlog = oneBlog.toObject();
            oneBlog.authorName = oneBlog.author.fname +" "+ oneBlog.author.lname;
            oneBlog.body =_.unescape(oneBlog.body);
            oneBlog.author = oneBlog.author.fname +" "+ oneBlog.author.lname;
            return res.status(200).json(oneBlog);
        }
           else{
            return res.status(404).json({msg: "Blog not found"});
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

    Blog.find(cond.where).skip(cond.offset).sort(cond.order).count()
        .then((countBlogs) => {
            return res.status(200).json({ count: countBlogs });
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.updateOne = (req, res) => {
    if(req.body.body){
        req.body.body = _.escape(req.body.body);
    }
    Blog.findByIdAndUpdate(req.param('id'), req.body, {new: true}).where({deleted: false}).populate('author').select({"deleted": 0})
        .then((oneBlog) => {
            if(oneBlog){
                oneBlog = oneBlog.toObject();
                oneBlog.authorName = oneBlog.author.fname +" "+ oneBlog.author.lname;
                oneBlog.body =_.unescape(oneBlog.body);
                oneBlog.author = oneBlog.author.fname +" "+ oneBlog.author.lname;
                return res.status(200).json(oneBlog);
            }
            else{
                return res.status(404).json({msg: "Blog not found"});
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

exports.deleteOne = (req, res) => {

    Blog.findByIdAndUpdate(req.param('id'), {deleted: true, status: 'deleted'}).where({deleted: false}).populate('author').select({"deleted": 0})
        .then((oneBlog) => {
            if(oneBlog){oneBlog = oneBlog.toObject();
                oneBlog.authorName = oneBlog.author.fname +" "+ oneBlog.author.lname;
                oneBlog.body =_.unescape(oneBlog.body);
                oneBlog.author = oneBlog.author.fname +" "+ oneBlog.author.lname;

                return res.status(200).json(oneBlog);
            }
            else{
                return res.status(404).json({msg: "Blog not found"});
            }
        })
        .catch((error) => {
            return res.status(500).json({ error: error.message });
        })

};

getAuthorBlog = (id) => {
    return new Promise(function(resolve, reject) {
        User.findById(id)
            .then(user => {
                resolve(user);
            })
            .catch((error) => {
                reject(error);
            })

    })

}