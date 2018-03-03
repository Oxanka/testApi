module.exports = function (allowed) {
    return function (req, res, next) {
        if (req.user.role == allowed){
            next();
        } else {
            return res.status(403).json({err: "Permission denied"});
        }
    }
}