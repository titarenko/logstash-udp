var should = require('should');
var dgram = require('dgram');
var logstash = require('../');

var socketParams = { appName: 'tests', host: 'localhost', port: 49152 };

function createFakeLogstashServer (onMessage) {
	var server = dgram.createSocket('udp4', onMessage);
	server.bind(socketParams.port);
	return server;
}

describe('logstash-udp', function () {
	describe('builder', function () {
		it('should return object with 3 methods for logging by level', function () {
			logstash('tests/index').should.have.properties(['debug', 'warning', 'error']);
		});
	});
	describe('logger.error', function () {
		it('should send message with level error', function (done) {
			var server = createFakeLogstashServer(function (data) {
				var message = JSON.parse(data.toString());
				message.should.have.properties(['@timestamp', 'type', 'source', 'level', 'message']);
				message.type.should.eql('tests');
				message.source.should.eql('tests/index');
				message.level.should.eql('ERROR');
				message.message.should.eql('oh no! everything is very bad!');
				server.close();
				done();
			});
			logstash.init(socketParams);
			var logger = logstash('tests/index');
			logger.error('oh no! %s', 'everything is very bad!');
		});
	});
});
