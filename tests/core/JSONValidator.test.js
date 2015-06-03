describe('JSONValidator', function() {
	var scope;
	
	beforeEach(module('starter.controllers'));
	
	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));
	
	it('should recognize valid JSON strings', function() {
		var validator = new JSONValidator();
		var goodJSON = "{\"name\": {\"field\": \"1\"}}";
		expect(validator.isValidJSON(goodJSON)).toEqual(true);
	});
	
	it('should recognize invalid JSON strings', function() {
		var validator = new JSONValidator();
		var badJSON = "{oweijro*&(**^(&*))}";
		expect(validator.isValidJSON(badJSON)).toEqual(false);
	});
});