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

function getPlaceholdersCount (message) {
	var match = message.match(/%[djs]/g);
	return match ? match.length : 0;
}

function formatMessage (message) {
	var params = Array.prototype.slice.call(arguments, 1);
	if (!params.length) {
		if (util.isError(message)) {
			return stringifyError(message);
		}
		return message;
	}
	var count = getPlaceholdersCount(message);
	var forPlaceholders = params.slice(0, count);
	var forAppend = params.slice(count).filter(function (it) {
		return it && it.toString() != '[object Object]';
	});
	return util.format.apply(util, [message].concat(forPlaceholders).concat(forAppend));
}

function getNonRenderables (message) {
	var params = Array.prototype.slice.call(arguments, 1);
	if (!params.length) {
		return null;
	}
	var count = getPlaceholdersCount(message);
	params = params.slice(count).filter(function (param) {
		return params && param.toString() == "[object Object]";
	});
	if (!params.length) {
		return null;
	}
	var result = {};
	params.forEach(function (param) {
		Object.getOwnPropertyNames(param).forEach(function (key) {
			result[key] = param[key];
		});
	});
	return result;
}

module.exports = {
	stringifyError: stringifyError,
	logUnexpectedError: logUnexpectedError,
	formatMessage: formatMessage,
	getNonRenderables: getNonRenderables
};
