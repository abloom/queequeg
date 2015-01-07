var partial = require("lodash").partial;

function addWebhook(singularity, hookBaseUrl, webhook, callback) {
    var hookUrl = hookBaseUrl + "/" + webhook;
    console.log("== adding Webhook %s for request type %s", hookUrl, webhook);

    singularity.webhooks.create(webhook, hookBaseUrl, function(err, data) {
        console.log("== response for request type %s: %s", webhook, data);
        callback(err);
    });
}

function deleteWebhook(singularity, hookBaseUrl, webhook, callback) {
    var hookUrl = hookBaseUrl + "/" + webhook;
    console.log("== removing Webhook %s for request type %s", hookUrl, webhook);

    singularity.webhooks.delete(webhook, hookBaseUrl, function(err, data) {
        console.log("== response for request type %s: %s", webhook, data);
        callback(null); // always return safely
    });
}

module.exports = function(singularity, hookBaseUrl) {
    return {
        addWebhook: partial(addWebhook, singularity, hookBaseUrl),
        deleteWebhook: partial(deleteWebhook, singularity, hookBaseUrl)
    };
}
