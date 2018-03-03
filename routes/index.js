const path = require('path'),
    fs = require('fs'),
    router = require('express').Router();

module.exports = (passport) => {
    let current = path.basename(__filename);

    fs.readdirSync(__dirname).forEach((file) => {
        let filename = file.split('.')[0];
        if (filename != 'index'){
            router.use('/' + filename, require(path.join(__dirname, filename))(passport));
        }
    });


    return router;
}
