module.exports = function(grunt) {
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		docular: {
			groups: [],
			showDocularDocs: true,
			showAngularDocs: true
		}
	});
	
	// Load the plugin that provides the docular tasks
	grunt.loadNpmTasks('grunt-docular');
	
	// Default task(s)
	grunt.registerTask('default', ['docular']);
};