const path = require('path'),
    fs = require('fs');
module.exports = () => {
    let middlewares = {};
    let current = path.basename(__filename);

    fs.readdirSync(__dirname).forEach((file) => {
        let middleware = file.split('.')[0];
        if (file != current) {
            middlewares[middleware] = require(path.join(__dirname, middleware));
        }
    });

    return middlewares;
}