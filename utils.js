var util = require('util');

Object.defineProperty(Error.prototype, 'toJSON', {
	configurable: true,
	value: function () {
		var self = {};
		Object.getOwnPropertyNames(this).forEach(function (key) {
			return self[key] = this[key];
		}.bind(this));
		return self;
	}
});

function stringifyError (error) {
	return JSON.stringify(error);
}

function logUnexpectedError (error) {
	if (error) {
		console.error(stringifyError(error));
	}
}

function formatMessage (message) {
	var params = Array.prototype.slice.call(arguments, 1);
	if (!params.length) {
		if (util.isError(message)) {
			return stringifyError(message);
		}
		return message;
	}
	var formatted = util.format.apply(util, [message].concat(params));
	if (message == formatted && params.length) {
		return formatMessage(message + ' %j', params);
	}
	return formatted;
}

module.exports = {
	stringifyError: stringifyError,
	logUnexpectedError: logUnexpectedError,
	formatMessage: formatMessage
};
