var express = require('express'),
    bodyParser = require('body-parser');

module.exports = function(config, callback) {
    var app = express();

    app.use(bodyParser.json());

    app.post(config.pathPrefix + '/:hook', function(req, res) {
        var type = req.params.hook.toUpperCase();

        console.log('------------------------------------------------------------------------')
        console.log('-- Callback for %s', type);
        console.log('--');
        console.log(JSON.stringify(req.body, null, 2));
        console.log('------------------------------------------------------------------------');

        res.sendStatus(200);
    });

    return app.listen(config.port, config.host, callback);
}
