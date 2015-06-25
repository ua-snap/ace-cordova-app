describe('DbHandler', function() {
	var scope;
	
	beforeEach(module('starter.controllers'));
	beforeEach(module('starter.services'));
	
	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));
	
	it('should successfully create a new database (or open an old database)', function() {
		var dbHandler = new DbHandler("ace_test.db", window);
		var result = dbHandler.createTables();
	});
});