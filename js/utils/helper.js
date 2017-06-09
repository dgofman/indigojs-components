'use strict';

define(['window'], function(win) {

	return function(options) {
		return {
			redirect: function(path, target) {
				target = target || win.top;
				if (Array.isArray(path)) {
					path = path.join('');
				}
				return target.location.href = options.contextPath + path;
			},

			substitute: function(str) {
				for (var i = 1; i < arguments.length; i += 2) {
					str = str.replace(new RegExp(arguments[i].replace('{', '\\{').replace('}', '\\}'), 'g'), arguments[i + 1]);
				}
				return str;
			},

			scrollView(comp) {
				comp.$el[0].scrollIntoView(true);
			}
		};
	};
});