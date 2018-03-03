const path = require('path'),
    fs = require('fs');
module.exports = () => {
    let models = {};
    let current = path.basename(__filename);

    fs.readdirSync(__dirname).forEach((file) => {
        let model = file.split('.')[0];
        if (file != current) {
            models[model] = require(path.join(__dirname, model));
        }
    });

    return models;
}