'use strict';

const fs = require('fs'),
	path = require('path'),
	babel = require('babel-core'),
	babelPlugins = ['transform-es2015-template-literals'];

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

	grunt.registerTask('ejs', function () {
		console.log('Compiling components...');
		let dir = path.resolve(__dirname, 'components');
		fs.readdirSync(dir).forEach(function(pkg) { //class package
			let contents = [];
			dir = path.resolve(dir, pkg);
			fs.readdirSync(dir).forEach(function(file) {
				let cls = pkg + file.charAt(0).toUpperCase() + file.substring(1),
					absPath = path.resolve(dir, file, file + '.ejs');
				if (fs.existsSync(absPath)) {
					if (!fs.existsSync(path.resolve(dir, file, file + '.js'))) {
						cls = '!' + cls;
					}
					if (!fs.existsSync(path.resolve(dir, file, file + '.less'))) {
						cls += '!';
					}
					contents.push(`<<[[${cls}]]>>`);
					contents.push(babelCode(fs.readFileSync(absPath, 'utf8')));
				}
			});
			fs.writeFileSync(path.resolve(__dirname, `build/${pkg}Components.html`), contents.join('\n'));
		});

		console.log('Compiling ejs contents...');
		let outDir = path.resolve(__dirname, 'build/ejs');
		if (!fs.existsSync(outDir)) {
			fs.mkdirSync(outDir);
		}
		dir = path.resolve(__dirname, 'ejs');
		fs.readdirSync(dir).forEach(function(file) {
			let index = file.lastIndexOf('.ejs');
			if (index === file.length - 4) {
				fs.writeFileSync(path.resolve(outDir, file.substring(0, index) + '.html'), babelCode(fs.readFileSync(path.resolve(dir, file), 'utf8')));
			}
		});
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['less', 'uglify', 'ejs']);
};

function babelCode(src) {
	return src.replace(/`(.*?(\s)*?)*?`/g, function(match) {
		let out = babel.transform(match, {
			plugins: babelPlugins
		}).code;
		return out.substring(0, out.length - 1); //remove ';' on end
	});
}