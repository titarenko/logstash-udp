var transport = require('./transport');
var utils = require('./utils');

function sendMessage (appName, source, level, message, params) {
	transport.send({
		'@timestamp': new Date().toISOString(),
		type: appName,
		source: source,
		level: level,
		message: utils.formatMessage(message, params)
	}, utils.logUnexpectedError);
}

function buildLogger (source) {
	return {
		debug: sendMessage.bind(this, appName, source, 'DEBUG'),
		warning: sendMessage.bind(this, appName, source, 'WARNING'),
		error: sendMessage.bind(this, appName, source, 'ERROR')
	};
}

var appName;

function init (params) {
	transport.close();
	transport.init({
		host: params.host,
		port: params.port
	}, utils.logUnexpectedError);
	appName = params.appName;
}

module.exports = buildLogger;
buildLogger.init = init;
