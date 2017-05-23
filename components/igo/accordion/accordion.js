/*jshint unused:false*/
function igoAccordion($) {
	'use strict';

	return {
		register: function(el) {
			var divs = $('>div>div[template]', el);
			for (var i = 0; i < divs.length; i++) {
				var div = divs.eq(i);
				div.html($('script' + div.attr('template')).html() || '');
			}
		}
	};
}