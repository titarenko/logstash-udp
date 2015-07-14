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
				message.should.have.properties(['@timestamp', 'type', 'env', 'source', 'level', 'message', 'data']);
				message.type.should.eql('tests');
				should(message.env == (process.env.NODE_ENV || null));
				message.source.should.eql('tests/index');
				message.level.should.eql('ERROR');
				message.message.should.eql('oh no! json: {"everything":"is broken"}, number: 1000, string: times');
				should.not.exists(message.data);
				server.close();
				done();
			});
			logstash.init(socketParams);
			var logger = logstash('tests/index');
			logger.error('oh no! json: %j, number: %d, string: %s', {everything: 'is broken'}, 1000, 'times');
		});
		it('should should provide data object as is if no placeholder exists', function (done) {
			var server = createFakeLogstashServer(function (data) {
				var message = JSON.parse(data.toString());
				message.should.have.properties(['@timestamp', 'type', 'env', 'source', 'level', 'message', 'data']);
				message.type.should.eql('tests');
				should(message.env == (process.env.NODE_ENV || null));
				message.source.should.eql('tests/index');
				message.level.should.eql('WARNING');
				message.message.should.eql('oh no! 1 times');
				message.data.should.eql({ everything: 'is broken', houston: 'we have a problem'});
				server.close();
				done();
			});
			logstash.init(socketParams);
			var logger = logstash('tests/index');
			logger.warning('oh no! %d', 1, {everything: 'is broken'}, 'times', {houston: 'we have a problem'});
		});
		it('should should allow to call log root object (builder call result) as debug logger', function (done) {
			var server = createFakeLogstashServer(function (data) {
				var message = JSON.parse(data.toString());
				message.type.should.eql('tests');
				message.level.should.eql('DEBUG');
				message.message.should.eql('wow! so debuge!');
				server.close();
				done();
			});
			logstash.init(socketParams);
			var logger = logstash('tests/index');
			logger('wow!', 'so debuge!');
		});
	});
});
