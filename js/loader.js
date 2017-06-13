'use strict';

(function(top) {
	var ig = top.indigoJS = top.indigoJS || {},
		staticPath = ig.staticPath || '/static',
		console = window.console;
	ig.rootScope = ig.rootScope || {};
	ig.wins = ig.wins || [];
	ig.cssPath = ig.cssPath || function(uri, type, pkg, cls) {
		if (ig.DEBUG && pkg !== 'jui') {
			return (uri || staticPath + '/css/') + pkg + '/' + cls + '/' + cls + '.css';
		} else {
			return (uri || staticPath + '/css/') + pkg + 'Components.css';
		}
	};
	ig.jsPath = ig.jsPath || function(uri, type, pkg, cls) {
		if (ig.DEBUG && pkg !== 'jui') {
			return (uri || '') + pkg + '/' + cls + '/' + cls + '.js';
		} else {
			return (uri || staticPath + '/js/') + pkg + 'Components.min.js';
		}
	};
	ig.jqPath = ig.jqPath || function(uri) {
		if (ig.DEBUG) {
			return (uri || 'js/jquery/') + 'jquery-3.1.1.js';
		} else {
			return (uri || staticPath + '/js/') + 'jquery-3.1.1.min.js';
		}
	};

	ig.debug = function() {
		if (ig.DEBUG && console) {
			console.log.apply(console, arguments);
		}
	};
	ig.info = function() {
		if (ig.INFO && console) {
			console.info.apply(console, arguments);
		}
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
		mains = document.querySelectorAll('input[igo-main]'),
		libs = core.getAttribute('libs').split(','),
		uri = core.getAttribute('uri'),
		head = top.document.head,
		loadedCss = ig.loadedCss = ig.loadedCss || {},
		loadedJs = ig.loadedJs = ig.loadedJs || {},
		addAsset = function(tag, attrs, type, onload) {
			var el, url = tag + (tag === 'link' ? '[href="' + attrs.href + '"]' : '[src="' + attrs.src + '"]');
			if (!head.querySelector(url)) {
				el = document.createElement(tag);
				for (var key in attrs) {
					el[key] = attrs[key];
				}
				el.onload = function() {
					(onload || loadHandler)(url, type);
				};
				head.appendChild(el);
			}
			return el;
		},
		loadHandler = function(url, ctype) {
			if (!top._jQueryFactory) {
				return;
			}
			if (loadedCss[ctype] === 2 || loadedJs[ctype]) {
				return;
			}
			var preinitialize = true;
			for (var i = 0; i < libs.length; i++) {
				var type = libs[i].replace('!', ''),
					selector = '[_=' + type + ']';

				if (loadedJs[type] === 0) {
					if (top[type]) {
						var cls = top[type];
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

				if (preinitialize && loadedCss[type] === 0) {
					var css = top.document.styleSheets;
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
						top[type].register(win.$, '[_=' + type + ']', win);
					});
				}
				for (type in loadedJs) {
					ig.wins.forEach(function(win) {
						win.$('[_=' + type + ']').removeClass('init').each(function(i, el) {
							ig.preinit(win.$, type, win.$(el));
						});
					});
				}
				for (var j = 0; j < mains.length; j++) {
					addAsset('script', {type: 'text/javascript', src: mains[j].value});
				}
			}
		};

	if (ig.wins.indexOf(window) === -1) {
		ig.wins.push(window);
	}
	if (mains.length) {
		addAsset('script', {type: 'text/javascript', src: ig.DEBUG ? 'js/indigo.js' : staticPath + '/js/indigo.min.js'});
	}
	addAsset('script', {type: 'text/javascript', src: ig.jqPath(uri)}, null, function(url, type) {
		ig.wins.forEach(function(win) {
			top._jQueryFactory(win);
			win.$.fn.extend({
				event: function(type, callback) {
					win.$.fn.off.call(this, type);
					win.$.fn.on.call(this, type, callback);
					return this;
				}
			});
		});
		loadHandler(url, type);
		if (ig.jqueryReady) {
			ig.jqueryReady(window.$);
		}
	});

	libs.forEach(function(lib) {
		var type = lib.replace('!', ''),
			pair = type.split(/(?=[A-Z])/);
			var pkg = pair[0],
			cls = pair[1].toLowerCase();
		if (loadedJs[type] === undefined) {
			if (lib.charAt(0) !== '!') { //exclude script
				loadedJs[type] = 0;
				addAsset('script', {type: 'text/javascript', src: ig.jsPath(uri, type, pkg, cls)}, type);
			}
		}
		if (loadedCss[type] === undefined) {
			if (lib.charAt(lib.length - 1) !== '!') { //exclude link
				loadedCss[type] = 0;
				addAsset('link', {rel: 'stylesheet', type: 'text/css', href: ig.cssPath(uri, type, pkg, cls)}, type);
			} else {
				loadedCss[type] = 1;
			}
		}
	});
	loadHandler();

})(window.top);