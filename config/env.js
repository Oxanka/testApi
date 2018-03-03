module.exports = {
    port: process.env.PORT || 8080,
    realm: process.env.REALM || 'http://localhost:8080/',
    db: {
        URI: process.env.DBURI || 'mongodb://localhost:27017/blog',
        retry: process.env.DBRETRY || 5
    },

    admin: {
        email: process.env.ADMINEMAIL || 'admin@test.com',
        fname: process.env.ADMINFNAME || 'admin',
        lname: process.env.ADMINLNAME || 'admin',
        password: process.env.ADMINPASSWORD || '123321',
        key: process.env.ADMINKEY || '7YLU1exv77'
    },
    redisStore: {
    url: process.env.REDIS_STORE_URI || 'http://localhost:6379',
    secret: process.env.REDIS_STORE_SECRET || 'myApi'
}
}