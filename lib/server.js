var express = require('express'),
    bodyParser = require('body-parser');

module.exports = function(config, action, callback) {
    var app = express();

    app.use(bodyParser.json());

    app.post(config.pathPrefix + '/:hook', function(req, res) {
        action(req.params.hook, req.body, function(err) {
            var statusCode= 200;
            if (err) statusCode = 400;

            res.sendStatus(statusCode);
        });
    });

    return app.listen(config.port, config.host, callback);
}
