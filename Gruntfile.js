'use strict';

const fs = require('fs'),
	path = require('path'),
	UglifyJS = require('uglify-js'),
	babel = require('babel-core'),
	babelPlugins = ['transform-es2015-template-literals'],
	regExp = /\/\*{{IMPORT:(.*)?}}\*\//,
	staticDir = './build/static',
	packages = ['igo', 'jui'];

module.exports = (grunt) => {

	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: false
				},
				files: [
					{
						expand: true,
						src: ['./igo/**/*.less', './jui/**/*.less'],
						dest: `${staticDir}/css`,
						ext: '.css'
					},
					{
						expand: true,
						src: './ejs/styles.ejs',
						dest: `${staticDir}/css`,
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
					'./build/static/css/igoComponents.css': ['./igo/**/*.less'],
					'./build/static/css/juiComponents.css': ['./jui/**/*.less'],
					'./build/static/css/index.css': ['./less/common.less', './less/indigo.less', './less/index.less'],
				}
			}
		}
	});

	grunt.registerTask('uglify', () => {
		packages.forEach(pkg => {
			let contents = {};
			grunt.file.recurse(path.resolve(__dirname, pkg), (abspath, rootdir, subdir, filename) => {
				if (filename.split('.').pop() === 'js') {
					let content = fs.readFileSync(abspath, 'utf8');
					content = content.replace(new RegExp(regExp, 'g'), (comment) => {
						const file = comment.match(regExp)[1];
						return fs.readFileSync(path.resolve(__dirname, file), 'utf8');
					});
					contents[`/${pkg}/${subdir}/${filename}`] = content;
				}
			});
			uglify(contents, `${pkg}Components`);
		});

		//compile builder.js, loader.js, indigo.js
		['builder', 'loader', 'indigo'].forEach(file => {
			const contents = {};
			contents[`/js/${file}.js`] = fs.readFileSync(path.resolve(__dirname, `js/${file}.js`), 'utf8');
			uglify(contents, `${file}`);
		});

		//utils files
		let contents = {};
		['request', 'dateFormat', 'errcode', 'validator', 'modelValidator', 'helper'].forEach(file => {
			let content = fs.readFileSync(path.resolve(__dirname, `js/utils/${file}.js`), 'utf8');
			contents[`/js/utils/${file}.js`] = content;
		});
		uglify(contents, 'utils');
	});

	grunt.registerTask('copy', () => {
		const destDir = path.resolve(__dirname,`${staticDir}/css/images`);
		grunt.file.recurse(path.resolve(__dirname, `node_modules/jquery-ui/themes/base/images`), (abspath, rootdir, subdir, filename) => {
			grunt.file.copy(abspath, path.resolve(destDir, filename));
		});

		grunt.file.recurse(path.resolve(__dirname, `js/jquery`), (abspath, rootdir, subdir, filename) => {
			grunt.file.copy(abspath, path.resolve(__dirname, `${staticDir}/js`, filename));
		});

		grunt.file.recurse(path.resolve(__dirname, `js/ejs`), (abspath, rootdir, subdir, filename) => {
			grunt.file.copy(abspath, path.resolve(__dirname, `${staticDir}/js`, filename));
		});
	});

	grunt.registerTask('ejs', () => {
		console.log('Compiling components...');
		packages.forEach(pkg => {
			let contents = [],
				dir = path.resolve(__dirname, pkg);
			fs.readdirSync(dir).forEach(file => {
				let cls = pkg + file.charAt(0).toUpperCase() + file.substring(1),
					absPath = path.resolve(dir, file, file + '.ejs');
				if (!fs.existsSync(path.resolve(dir, file, file + '.js'))) {
					cls = '!' + cls;
				}
				if (!fs.existsSync(path.resolve(dir, file, file + '.less'))) {
					cls += '!';
				}
				contents.push(`<<[[${cls}]]>>`);
				if (fs.existsSync(absPath)) {
					contents.push(babelCode(fs.readFileSync(absPath, 'utf8')));
				} else {
					contents.push('');
				}
			});
			fs.writeFileSync(path.resolve(__dirname, `build/${pkg}Components.html`), contents.join('\n'));
		});

		console.log('Compiling ejs contents...');
		let srcDir = path.resolve(__dirname, 'ejs'),
			destDir = path.resolve(__dirname, 'build/ejs');
		if (!fs.existsSync(destDir)) {
			fs.mkdirSync(destDir);
		}
		fs.readdirSync(srcDir).forEach(file => {
			let index = file.lastIndexOf('.ejs');
			if (file !== 'styles.ejs' && index === file.length - 4) {
				fs.writeFileSync(path.resolve(destDir, file.substring(0, index) + '.html'), babelCode(fs.readFileSync(path.resolve(srcDir, file), 'utf8')));
			}
		});
	});

	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('all', ['less', 'uglify', 'ejs', 'copy']);
	grunt.registerTask('default', ['less', 'uglify', 'copy']);
};

const babelCode = (src) => {
	return src.replace(/`(.*?(\s)*?)*?`/g, (match) => {
		let out = babel.transform(match, {
			plugins: babelPlugins
		}).code;
		return out.substring(0, out.length - 1); //remove ';' on end
	});
};

const uglify = (contents, file) => {
	let options = {
		warnings: true,
		output: {
			quote_style: 3
		},
		sourceMap: {
			filename: `${file}.min.js`,
			url: `${file}.min.map`
		}
	};

	const result = UglifyJS.minify(contents, options);
	if (result.error) {
		console.error(result.error);
	} else {
		fs.writeFileSync(path.resolve(__dirname, `${staticDir}/js/${options.sourceMap.filename}`), result.code);
		fs.writeFileSync(path.resolve(__dirname, `${staticDir}/js/${options.sourceMap.url}`), result.map);
	}
};