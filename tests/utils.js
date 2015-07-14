var utils = require('../utils');
var should = require('should')

describe('utils', function () {
	describe('formatMessage', function () {
		it('should return initial message when no formatting params are passed', function () {
			utils.formatMessage('message').should.eql('message');
		});
		it('should return initial message when no formatting params are passed even if there are placeholders', function () {
			utils.formatMessage('message %d').should.eql('message %d');
		});
		it('should format message if there are placeholders and params', function () {
			utils.formatMessage('message %d: %s', 1, 'abba').should.eql('message 1: abba');
		});
		it('should stringify error', function () {
			try {
				throw new Error('Bad thing happened!');
			} catch (error) {
				utils.formatMessage(error).should.startWith('{"stack":"Error: Bad thing happened!');
			}
		});
		it('should append non-objects to message even there are no placeholders for them', function () {
			utils.formatMessage('my message', '100s', 2).should.eql('my message 100s 2');
		});
	});
	describe('getNonRenderables', function () {
		it('should return null if everything renders', function () {
			should.not.exist(utils.getNonRenderables('abba %d', {a: 2}));
		});
		it('should return null if no params', function () {
			should.not.exist(utils.getNonRenderables('abba %d'));
		});
		it('should omit arrays', function () {
			should.not.exist(utils.getNonRenderables('abba %d', [1, 2, 3]));
		});
		it('should omit strings and numbers', function () {
			should.not.exist(utils.getNonRenderables('abba %d', 1, 'aaa'));
		});
		it('should return all non-renderable params', function () {
			var result = utils.getNonRenderables('abba %d', 1, 'aaa', {a: 'b'}, 'string', {d: 1});
			result.should.have.properties(['a', 'd']);
			result.a.should.eql('b');
			result.d.should.eql(1);
		});
	});
});
