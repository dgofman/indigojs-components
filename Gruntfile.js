'use strict';

const fs = require('fs'),
	path = require('path');

module.exports = function(grunt) {

	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: false
				},
				files: [
					{
						expand: true,
						src: ['./components/**/*.less'],
						dest: './build/css',
						ext: '.css'
					}
				]
			},
			production: {
				options: {
					strictMath: false,
					compress: true
				},
				files: {
					'./build/css/components.css': ['./components/**/*.less'],
					'./build/css/index.css': ['./less/common.less', './less/indigo.less', './less/index.less'],
				}
			}
		},

		uglify: {
			production: {
				options: {
					expand: true,
					sourceMap: true,
					sourceMapName : './build/js/components.map',
					quoteStyle: 3
				},
				src: ['./components/**/*.js', '!jquery/**'],
				dest: './build/js/components.min.js'
			}
		}
	});

	grunt.registerTask('html', function () {
		const dir = path.resolve(__dirname, 'components'),
			contents = [];
		fs.readdirSync(dir).forEach(function(file) {
			let type = file,
				absPath = path.resolve(dir, file, file + '.html');
			if (fs.existsSync(absPath)) {
				if (!fs.existsSync(path.resolve(dir, file, file + '.js'))) {
					type = '!' + type;
				}
				if (!fs.existsSync(path.resolve(dir, file, file + '.less'))) {
					type += '!';
				}
				contents.push('<<[[' + type + ']]>>');
				contents.push(fs.readFileSync(absPath, 'utf8'));
			}
		});
		fs.writeFileSync(path.resolve(__dirname, 'build/components.html'), contents.join('\n'));
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['less', 'uglify', 'html']);
};