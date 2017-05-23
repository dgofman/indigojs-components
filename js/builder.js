'use strict';

(function(ig) {
	var staticPath = ig.staticPath || '/static',
		templates = {},
		libs = [],
		loader = function(url, callback) {
		var xhr = new window.XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onreadystatechange = function() {
			if(xhr.readyState === window.XMLHttpRequest.DONE && xhr.status === 200) {
				callback(xhr.responseText);
			}
		};
		xhr.send();
	};

	var pkgName = 'igo';
	loader('./build/' + pkgName + 'Components.html', function(data) {
		var componentIndex = 0,
			arr = data.split(/<<\[\[(.*)\]\]>>/);
		for (var i = 1; i < arr.length; i += 2) {
			libs.push(arr[i]);
			templates[arr[i].replace('!', '')] = arr[i + 1];
		}

		var createModel = function(model, opts) {
			model = model || {};
			model.baseStaticPath = staticPath,
			model.opts = opts || {},
			model.$ = function(type, opts) {
				var begin, html = '';
				if (templates[type]) {
					opts = opts || {};
					model.opts = opts || {};
					model.componentIndex = componentIndex++;
					begin = '<c ' + type + ' tabindex="-1" class="init' + model.$get('class') + '"' + model.$get('disabled', 'disabled') + model.$attr('id');
					html = window.ejs.render(templates[type], model);
					if (opts.show === false) {
						opts.parentStyle = 'display: none; ' + opts.parentStyle || '';
					}
					html = begin + model.$attr('parentStyle', 'style') + '>' + html + '</c>';
				}
				return html;
			};
			model.$get = function(name, val) {
				if (model.opts[name] !== undefined) {
					if (val === undefined) {
						return ' ' + model.opts[name];
					} else {
						return ' ' + val;
					}
				}
				return '';
			};
			model.$attr = function(name, tagName) {
				if (model.opts[name] !== undefined) {
					if (tagName === undefined) {
						return ' ' + name + '="' + model.opts[name] + '"';
					} else {
						return ' '  + tagName + '="' + model.opts[name] + '"';
					}
				}
				return '';
			};
			model.$attrs = function(name) {
				var attrs = [],
					obj = model.opts[name];
				for (var key in obj) {
					attrs.push(key + '="' + obj[key] + '"');
				}
				return attrs.length ? ' ' + attrs.join(' ') : '';
			};
			model.$css = function(name, tagName) {
				if (model.opts[name] !== undefined) {
					if (tagName === undefined) {
						return ' ' + name + ': ' + model.opts[name] + ';';
					} else {
						return ' ' + tagName + ': ' + model.opts[name] + ';';
					}
				}
				return '';
			};
			model.$title = function(title) {
				title = title || model.opts.title;
				return ' ' + (title ? ' title="' + title + '"' : '');
			};
			model.$label = function(title) {
				title = title || model.opts.title;
				return ' ' + (title ? ' aria-label="' + title + '"' : '');
			};
			model.$assign = function(opts, model) {
				model = model || opts;
				return createModel(model, opts);
			};
			model.$finalize = function() {
				return '';
			};
			return model;
		};

		ig.builder = function(contentPath, parent) {
			var model = createModel();
			loader(contentPath, function(data) {
				var html = window.ejs.render(data, model),
					scripts = parent.querySelectorAll('script');
				parent.innerHTML = html;
				for (var i = 0; i < scripts.length; i++) {
					try {
						/*jshint evil:true */
						eval(scripts[i].innerHTML);
					} catch (e) {}
				}
				var script = document.createElement('script');
				script.src = 'js/loader.js';
				script.setAttribute('rel', 'igcore');
				script.setAttribute('uri', 'build/css');
				script.setAttribute('libs', libs.join(','));
				parent.appendChild(script);
			});
		};

		var all = document.querySelectorAll('[indigo-builder]');
		for (var j = 0; j < all.length; j++) {
			ig.builder(all[j].getAttribute('indigo-builder'), all[j]);
		}
	});
})(window.top.indigoJS = (window.top.indigoJS || {}));