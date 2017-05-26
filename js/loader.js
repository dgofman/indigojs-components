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
	ig.preinit = function($, type, el) {
		var apis = loadedJs[type]($, type, ig);
		if (apis) {
			if (apis.preinit) {
				apis.preinit(el);
			}
		}
	};

	var core = document.querySelector('script[rel=igocore]'),
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
					(onload || loadHandler)(selector);
				};
				head.appendChild(el);
			}
			return el;
		},
		loadHandler = function() {
			if (!window._jQueryFactory) {
				return;
			}
			var preinitialize = true;
			for (var i = 0; i < libs.length; i++) {
				var type = libs[i].replace('!', ''),
					selector = '[_=' + type + ']';

				if (loadedCss[type] === 0) {
					var css = parent.document.styleSheets;
					loop1:
					for (var k = 0; k < css.length; k++) {
						var rules = css[k].cssRules || css[k].rules;
						for (var l = 0; l < rules.length; l++) {
							var text = rules[l].selectorText || '';
							if (text.indexOf(type) !== -1) {
								loadedCss[type] = 1;
								break loop1;
							}
						}
					}
				}

				if (loadedJs[type] === 0) {
					if (parent[type]) {
						var cls = parent[type];
						cls.register = cls.register || function() {};
						if (cls.loaded) {
							ig.wins.forEach(function(win) {
								cls.loaded(win.$, win);
							});
						}
						loadedJs[type] = cls;
					} else {
						preinitialize = false;
					}
				}

				if (loadedCss[type] === 1 && loadedJs[type] !== 0) {
					loadedCss[type] = 2;
					ig.wins.forEach(function(win) {
						win.$(selector).removeClass('init');
					});
				}
			}
			if (preinitialize) {
				for (type in loadedJs) {
					ig.wins.forEach(function(win) {
						var selector = '[_=' + type + ']';
						parent[type].register(win.$, selector, win);
						win.$(selector).removeClass('init').each(function(i, el) {
							ig.preinit(win.$, type, win.$(el));
						});
					});
				}
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
		loadHandler(selector);
		if (ig.jqueryReady) {
			ig.jqueryReady(window.$);
		}
	});

	libs.forEach(function(lib) {
		var type = lib.replace('!', ''),
			pair = type.split(/(?=[A-Z])/);
			var pkg = pair[0],
			cls = pair[1].toLowerCase();
		if (lib.charAt(0) !== '!') { //exclude script
			loadedJs[type] = 0;
			addAsset('script', {type: 'text/javascript', src: ig.jsPath(uri, type, pkg, cls)});
		}
		if (lib.charAt(lib.length - 1) !== '!') { //exclude link
			loadedCss[type] = 0;
			addAsset('link', {rel: 'stylesheet', type: 'text/css', href: ig.cssPath(uri, type, pkg, cls)});
		} else {
			loadedCss[type] = 1;
		}
	});
	loadHandler();

})(window.top);