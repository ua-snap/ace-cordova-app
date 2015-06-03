describe('LocalStorageUtil', function() {
	var scope;
	
	beforeEach(module('starter.controllers'));
	
	beforeEach(inject(function($rootScope) {
		scope = $rootScope.$new();
	}));
	
	it('should properly save String values', function() {
		var local = new LocalStorageUtil(window);
		var value = "this is the string value";
		local.set("key", value);
		
		expect(local.get("key", null)).toEqual(value.toString());
	});
	
	it('should properly save Object values', function() {
		var local = new LocalStorageUtil(window);
		var value = {
			field1: "1",
			field2: "2"
		};
		
		local.set("key", value);
		expect(local.get("key", null)).toEqual(value);
	});
	
	it('should return the default value when an invalid key is provided', function() {
		var local = new LocalStorageUtil(window);
		var defaultValue = "default";
		
		expect(local.get("badkey", defaultValue)).toEqual(defaultValue);
	});
});