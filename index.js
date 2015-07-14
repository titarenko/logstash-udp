var transport = require('./transport');
var utils = require('./utils');

function sendMessage (appName, source, level, message) {
	var params = Array.prototype.slice.call(arguments, 4);
	transport.send({
		'@timestamp': new Date().toISOString(),
		type: appName,
		env: process.env.NODE_ENV || null,
		source: source,
		level: level,
		message: utils.formatMessage.apply(utils, [message].concat(params)),
		data: utils.getNonRenderables.apply(utils, [message].concat(params))
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
