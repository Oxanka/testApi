const router = require('express').Router(),
    expressListRoutes   = require('express-list-routes');

let commentCtrl = require('../controllers/commentsCtrl');

module.exports = (passport) => {

    router.get('/count', commentCtrl.count);
    router.get('/', commentCtrl.getAll);
    router.get('/:id', commentCtrl.getOne);
    router.post('/', passport.authenticate('bearer'), commentCtrl.create);
    router.put('/:id', passport.authenticate('bearer'), commentCtrl.updateOne);
    router.delete('/:id', passport.authenticate('bearer'), commentCtrl.deleteOne);

    expressListRoutes({ prefix: "/api/comments" }, "API:", router );
    return router;
}