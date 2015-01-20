var url = require('url'),
    async = require('async'),
    createAmqp = require('./lib/amqp'),
    createServer = require('./lib/server'),
    createSingularity = require('./lib/singularity'),
    hookRegistration = require('./lib/hooks/registration'),
    hookAction = require('./lib/hooks/action');

function formatUrl(hostname, port, pathname) {
    return url.format({
        protocol: "http",
        hostname: hostname,
        pathname: pathname,
        port: port
    });
}

var port = process.env.PORT || 3000,
    host = process.env.HOST || 'localhost',
    singularityPort = process.env.SINGULARITY_PORT || 7099,
    singularityHost = process.env.SINGULARITY_HOST || 'localhost',
    singularityBase = process.env.SINGULARITY_BASE;

// a blank string represents 'no base path' and is valid
if (singularityBase === undefined || singularityBase === null) {
    singularityBase = '/singularity';
}

var serverBaseUrl = formatUrl(host, port),
    hookPathPrefix = "/webhook",
    hookBaseUrl = serverBaseUrl + hookPathPrefix,
    singularityUrl = formatUrl(singularityHost, singularityPort, singularityBase);

var serverConfig = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    pathPrefix: "/webhook"
};

var amqpConfig = {};

var singularity = createSingularity(singularityUrl);

var _temp = hookRegistration(singularity, hookBaseUrl),
    addWebhook = _temp.addWebhook,
    deleteWebhook = _temp.deleteWebhook;

var hooks = [ 'deploy', 'request' ];

process.on('SIGINT', function() {
    console.log("");

    // unregister hooks with singularity
    async.each(hooks, deleteWebhook, function() {
        process.exit();
    });
});

createAmqp(amqpConfig, function(err, amqp) {
    server = createServer(serverConfig, hookAction(amqp), function () {
        console.log('========================================================================');
        console.log('== QUEEQUEG - Singularity webhook debugger listening at %s', hookBaseUrl);
        console.log('==');
        console.log('== using singularity at %s', singularityUrl);

        // register hooks with singulariy
        async.each(hooks, addWebhook, function(err) {
            if (err) throw err;
            console.log("== All hooks enabled");
        });
    });
});
