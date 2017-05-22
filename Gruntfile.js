'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		less: {
			compileCore: {
				options: {
					strictMath: false,
					compress: true
				},
				files: [
					{
						expand: true,
						cwd: "./components",
						src: [ "**/*.less" ],
						dest: "./build/css",
						ext: ".css"
					},
					{
						expand: true,
						cwd: "./less",
						src: ["common.less", "index.less"],
						dest: "./build/css",
						ext: ".css"
					}
				]
			}
		},

		uglify: {
				options: {
					sourceMap: true,
					quoteStyle: 3
				},
				static: {
					files: [
					{
						expand: true,
						cwd: "./components",
						src: ['**/*.js', '!jquery/**'],
						dest: './build/js',
						ext: '.min.js'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['less', 'uglify']);
};