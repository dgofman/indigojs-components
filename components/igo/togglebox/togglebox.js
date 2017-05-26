/*jshint unused:false*/
function igoTogglebox($) {
	'use strict';

	return {
		preinit: function(el) {
			var divs = $('>div[template]', el);
			for (var i = 0; i < divs.length; i++) {
				var div = divs.eq(i);
				div.html($('script' + div.attr('template')).html() || '');
			}
		}
	};
}