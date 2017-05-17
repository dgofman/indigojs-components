/*jshint unused:false*/
function ToggleBox($, indigo) {
	'use strict';
	indigo.debug('Init ToggleBox');

	return {
		register: function(el) {
			var divs = $('>div[template]', el);
			for (var i = 0; i < divs.length; i++) {
				var div = divs.eq(i);
				div.html($('script' + div.attr('template')).html() || '');
			}
		}
	};
}