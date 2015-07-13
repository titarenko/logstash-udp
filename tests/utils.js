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
	});
});
