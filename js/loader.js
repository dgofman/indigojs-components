'use strict';

(function(parent) {
	var ig = parent.indigoJS = parent.indigoJS || {};
	ig.wins = ig.wins || [];
	ig.cssPath = ig.cssPath || function(uri, type, pkg, cls) {
		return uri + '/' + pkg + '/' + cls + '.css';
	};
	ig.jsPath = ig.jsPath || function(uri, type, pkg, cls) {
		return uri + '/' + pkg + '/' + cls + '.js';
	};
	ig.jqPath = ig.jqPath || function() {
		return uri + '/jquery/jquery-3.1.1' + (ig.DEBUG ? '' : '.min') + '.js';
	};
	ig.attr = function(el, type, val) {
		return val ? el.attr(type, type) : el.removeAttr(type);
	},
	ig.class = function(el, name, isAdd) {
		return isAdd ? el.addClass(name) : el.removeClass(name);
	},
	ig.register = function($, type, el) {
		var cls = loadedJs[type];
		if (cls) {
			var apis = cls($, '[' + type + ']', ig);
			if (apis.register) {
				apis.register(el);
			}
		}
	};

	var core = document.querySelector('script[rel=igcore]'),
		libs = core.getAttribute('libs').split(','),
		uri = core.getAttribute('uri'),
		head = parent.document.head,
		loadedCss = ig.loadedCss = ig.loadedCss || {},
		loadedJs = ig.loadedJs = ig.loadedJs || {},
		addAsset = function(tag, attrs, onload) {
			var el, selector = tag + (tag === 'link' ? '[href="' + attrs.href + '"]' : '[src="' + attrs.src + '"]');
			if (!head.querySelector(selector)) {
				el = document.createElement(tag);
				for (var key in attrs) {
					el[key] = attrs[key];
				}
				el.onload = function() {
					(onload || init)(selector);
				};
				head.appendChild(el);
			}
			return el;
		},
		init = function() {
			if (!window._jQueryFactory) {
				return;
			}
			for (var i = 0; i < libs.length; i++) {
				var type = libs[i].replace('!', '');
				if (loadedJs[type] === false) {
					if (window[type]) {
						loadedJs[type] = window[type];
					} else {
						return;
					}
				}
				if (loadedCss[type] === false) {
					var css = parent.document.styleSheets,
						selector = '[' + type.toLowerCase() + ']';
					loop1:
					for (var j = 0; j < 1; j++) {
						for (var k = 0; k < css.length; k++) {
							var rules = css[k].rules || css[k].cssRules;
							for (var l = 0; l < rules.length; l++) {
								var text = rules[l].selectorText || '';
								if (text.indexOf(selector) !== -1) {
									loadedCss[type] = true;
									ig.wins.forEach(function(win) {
										win.$(selector).removeClass('init');
									});
									break loop1;
								}
							}
						}
						return;
					}
				}
			}
			for (type in loadedJs) {
				ig.wins.forEach(function(win) {
					win.$.each(win.$('[' + type + ']').removeClass('init'), function(i, el) {
						ig.register(win.$, type, win.$(el));
					});
				});
			}
		};

	if (ig.wins.indexOf(window) === -1) {
		ig.wins.push(window);
	}
	addAsset('script', {type: 'text/javascript', src: ig.jqPath(uri)}, function(selector) {
		ig.wins.forEach(function(win) {
			window._jQueryFactory(win);
			win.$.fn.extend({
				event: function(type, callback) {
					win.$.fn.off.call(this, type);
					win.$.fn.on.call(this, type, callback);
					return this;
				}
			});
		});
		init(selector);
		if (ig.jqueryReady) {
			ig.jqueryReady(window.$);
		}
	});

	libs.forEach(function(lib) {
		var type = lib.replace('!', ''),
			pair = type.split(/(?=[A-Z])/);
			var pkg = pair[0],
			cls = pair[1].toLowerCase();
		if (lib.charAt(lib.length - 1) !== '!') { //exclude link
			loadedCss[type] = false;
			addAsset('link', {rel: 'stylesheet', type: 'text/css', href: ig.cssPath(uri, type, pkg, cls)});
		}
		if (lib.charAt(0) !== '!') { //exclude script
			loadedJs[type] = false;
			addAsset('script', {type: 'text/javascript', src: ig.jsPath(uri, type, pkg, cls)});
		}
	});
	init();

})(window.top);