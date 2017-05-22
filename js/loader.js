'use strict';

(function(parent) {
	var ig = parent.indigoGlobal || {};
	ig.libs = ig.libs || {
		indigo: {w:[], i: 0, t: 1}
	};
	ig.cssPath = ig.cssPath || function(uri, type) {
		return uri + '/' + type + '.css';
	};
	ig.jsPath = ig.jsPath || function(uri, type) {
		return uri + '/' + type + '.js';
	};
	ig.jqPath = ig.jqPath || function() {
		return '/indigojs/jquery/jquery-3.1.1' + (ig.DEBUG ? '' : '.min') + '.js';
	};
	ig.register = function($, type, el) {
		var item = ig.libs[type];
		if (item && item.class) {
			var apis = item.class($, '[cid=' + type + ']', ig);
			if (apis.register) {
				apis.register(el);
			}
		}
	};
	parent.indigoGlobal = ig;

	var core = document.querySelector('script[rel=igcore]'),
		libs = core.getAttribute('libs').split(','),
		uri = core.getAttribute('uri'),
		head = parent.document.head,
		addAsset = function(tag, attrs, onload) {
			var el, selector = tag + (tag === 'link' ? '[href="' + attrs.href + '"]' : '[src="' + attrs.src + '"]');
			if (!head.querySelector(selector)) {
				el = document.createElement(tag);
				for (var key in attrs) {
					el[key] = attrs[key];
				}
				el.onload = onload;
				if (onload) {
					head.appendChild(el);
				}
			}
			return el;
		},
		init = function() {
			var types = [],
				igo = ig.libs.indigo;
			for (var i = 0; i < libs.length; i++) {
				var type = libs[i].replace('!', ''),
					item = ig.libs[type];
				if (item.i < item.t || igo.i < igo.t) { //verify loaded libraries
					return;
				}
				types.push(type);
			}
			types.forEach(function(type) {
				var selector = '[cid=' + type + ']';
				ig.libs.indigo.w.forEach(function(win) {
					win.$.each(win.$(selector), function(i, el) {
						ig.register(win.$, type, win.$(el));
					});
					win.$(selector).removeClass('init');
				});
			});
		};

	if (ig.libs.indigo.w.indexOf(window) === -1) {
		ig.libs.indigo.w.push(window);
	}
	var path = ig.jqPath(uri),
		link = addAsset('link', {rel: 'stylesheet', type: 'text/css', href: uri + '/common.css'});
	if (link) {
		head.insertAdjacentElement('afterbegin', link);
	}
	addAsset('script', {type: 'text/javascript', src: path}, function() {
		var item = ig.libs.indigo;
		item.w.forEach(function(win) {
			window._jQueryFactory(win);
			win.$.fn.extend({
				event: function(type, callback) {
					win.$.fn.off.call(this, type);
					win.$.fn.on.call(this, type, callback);
					return this;
				}
			});
		});
		init(path, ++item.i);
		if (ig.jqueryReady) {
			ig.jqueryReady(window.$);
		}
	});

	libs.forEach(function(lib) {
		var begin = 0, end = lib.length, path, total = 2;
		if (lib.charAt(0) === '!') { //exclude script
			total--;
			begin++;
		}
		if (lib.charAt(end - 1) === '!') { //exclude link
			total--;
			end--;
		}
		var type = lib.substring(begin, end),
			item = ig.libs[type] = ig.libs[type] || {i: 0, t: total};

		if (end === lib.length) {
			path = ig.cssPath(uri, type);
			addAsset('link', {rel: 'stylesheet', type: 'text/css', href: path}, function() {
				init(path, ++item.i);
			});
		}
		if (begin === 0) {
			path = ig.jsPath(uri, type);
			addAsset('script', {type: 'text/javascript', src: path}, function() {
				item.class = window['igo' + type[0].toUpperCase() + type.slice(1)];
				init(path, ++item.i);
			});
		}
	});
	init();

})(window.top);