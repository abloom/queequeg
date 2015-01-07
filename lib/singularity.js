var Singularity = require('singularity-client');

module.exports = function(singularityUrl) {
    var singularity = new Singularity({
            singularity: {
                baseUrl: singularityUrl,
                connectTimeout: 5000
            }
        });

    if (process.env.DEBUG) {
        var debugEvents = ["connect", "success", "failure"],
            hub = singularity.hub;

        debugEvents.forEach(function(evt) {
            hub.on(evt, function(msg) {
                console.log(evt.toUpperCase(), msg);
            });
        });
    }

    return singularity;
}
