const router = require('express').Router(),
    expressListRoutes   = require('express-list-routes');

const blogCtrl = require('../controllers/blogCtrl');

module.exports = (passport) => {

    router.get('/count', blogCtrl.count);
    router.get('/', blogCtrl.getAll);
    router.get('/:id', blogCtrl.getOne);
    router.post('/', passport.authenticate('bearer'), blogCtrl.create);
    router.put('/:id', passport.authenticate('bearer'), blogCtrl.updateOne);
    router.delete('/:id', passport.authenticate('bearer'), blogCtrl.deleteOne);

    expressListRoutes({ prefix: "/api/blog" }, "API:", router );
    return router;
}