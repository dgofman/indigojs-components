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
					'./build/css/igoComponents.css': ['./components/igo/**/*.less'],
					'./build/css/index.css': ['./less/common.less', './less/indigo.less', './less/index.less'],
				}
			}
		},

		uglify: {
			igo: {
				options: {
					expand: true,
					sourceMap: true,
					sourceMapName : './build/js/igoComponents.map',
					quoteStyle: 3
				},
				src: ['./components/igo/**/*.js', '!jquery/**'],
				dest: './build/js/igoComponents.min.js'
			}
		}
	});

	grunt.registerTask('html', function () {
		let dir = path.resolve(__dirname, 'components');
		fs.readdirSync(dir).forEach(function(pkg) { //class package
			let contents = [];
			dir = path.resolve(dir, pkg);
			fs.readdirSync(dir).forEach(function(file) {
				let type = pkg + file.charAt(0).toUpperCase() + file.substring(1),
					absPath = path.resolve(dir, file, file + '.ejs');
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
			fs.writeFileSync(path.resolve(__dirname, `build/${pkg}Components.html`), contents.join('\n'));
		});
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['less', 'uglify', 'html']);
};