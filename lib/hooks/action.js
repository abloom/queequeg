var partial = require("lodash").partial;

var publishOptions = {};

function routingKey(type, payload) {
  var action = type,
      requestId, state;

  switch (type) {
    case 'task':
      requestId = payload.task.taskRequest.request.id;
      state = payload.taskUpdate.taskState;
      break;

    case 'deploy':
      requestId = payload.deploy.requestId;
      state = payload.eventType;
      break;

    case 'request':
      requestId = payload.request.id;
      state = payload.eventType;
  }

  return type + "." + requestId + "." + state;
}

function publishMessage(exchange, type, payload, callback) {
    console.log('------------------------------------------------------------------------');
    console.log('-- Callback for %s', type.toUpperCase());
    console.log('------------------------------------------------------------------------');

    var key = routingKey(type, payload);
    exchange.publish(key, payload, publishOptions, function(err) {
        if (!err) {
            console.log("-- Message published key: " + key);
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
