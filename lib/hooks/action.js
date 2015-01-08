var partial = require("lodash").partial;

var publishOptions = {};

function publishMessage(exchange, type, payload, callback) {
    console.log('------------------------------------------------------------------------')
    console.log('-- Callback for %s', type);
    console.log('--');
    console.log(JSON.stringify(payload, null, 2));
    console.log('------------------------------------------------------------------------');

    exchange.publish(type, payload, publishOptions, function(err) {
        if (!err) {
            console.log("-- Message published");
            callback();
        } else {
            console.log("-- Message failed to publish");
            callback("Message failed to publish");
        }
    });
}

module.exports = function(amqpExchange) {
    return partial(publishMessage, amqpExchange);
}
