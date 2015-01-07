var amqp = require('amqp');

function createExchange(callback) {
}

module.exports = function(config, callback) {
    var amqpConnection = amqp.createConnection(config);

    amqpConnection.on('error', function(err) {
        console.log(err.stack);
    });

    amqpConnection.on('close', function(err) {
        console.log("AMQP closed");
    });

    amqpConnection.once('ready', function() {
        amqpConnection.exchange('singularity-hooks', {
            durable: true,
            autoDelete: false,
            confirm: true
        }, function(amqpExchange) { callback(null, amqpExchange); });
    });
}


