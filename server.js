// MODULES
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    dotenv = require('dotenv'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    http = require('http'),
    path = require('path'),
    config = require('./config/env'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session);

global.baseFolder = __dirname;
global.models = require('./models/index')();

const env = require('./config/env'),
    db = require('./config/db'),
    passport = require('./config/passport-conf')(app);

require('./config/db')(mongoose, env);

app.set('port', env.port);
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(cookieParser());
// app.use(require('express-session')({
//     secret: 'test-api',
//     resave: false,
//     saveUninitialized: false
// }));

app.use(session({
    store: new RedisStore({
        url: config.redisStore.url
    }),
    cookie: {
        secure: process.env.ENVIRONMENT !== 'development' && process.env.ENVIRONMENT !== 'test',
        maxAge: 2419200000
    },
    secret: config.redisStore.secret,
    resave: false,
    saveUninitialized: false
}))

//API
app.use('/', express.static(path.join(__dirname, 'public', 'dist')));
app.use('/api', require('./routes/index.js')(passport));
app.get('/*', (req, res) => {
    res.send('frontend');
});

process.on("uncaughtException", (err) => {
    console.log(err);
});

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Server started at ${app.get('port')} with ${process.pid} process id`);
})