var util = require('util');
var dgram = require('dgram');

var socketParams, socket;

function init (params, errorHandler) {
	if (socket) {
		throw new Error('Already initialized.');
	}
	socketParams = params;
	socket = dgram.createSocket('udp4');
	if (errorHandler) {
		socket.on('error', errorHandler);
	}
	return socket;
}

function send (obj, cb) {
	var message = new Buffer(JSON.stringify(obj));
	return socket.send(message, 0, message.length, socketParams.port, socketParams.host, cb);
}

function close () {
	if (socket) {
		socket.close();
		socket = socketParams = null;
	}
}

module.exports = {
	init: init,
	send: send,
	close: close
};
