const passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    env = require('./env')

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(global.models.user.createStrategy());
    passport.use(new BearerStrategy(
        function (token, done) {
            global.models.token.findOne({ hash: token }).populate('user').exec(function (err, token) {
                if (err) { return done(err); }
                if (!token) { return done(null, false); }
                if ((Math.abs(Date.now() - token.lastUsed) / 36e5) >= 24){
                    global.models.answer.remove({
                        user: token.user._id
                    }, (err, result) => { })
                }
                token.lastUsed = Date.now();
                token.save();
                return done(null, token.user);
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    return passport;
}