/*jshint unused:false*/
function igoTabs($) {
	'use strict';

	return {
		preinit: function(el) {
			var section = $('>section', el),
				divs = section.find('>div'),
				inputs = $('>div>input', el).event('change.tabs', function() {
					divs.hide();
					var index = inputs.filter(':checked').parent().index();
					divs.eq(index).show();
				});
			for (var i = 0; i < divs.length; i++) {
				var div = divs.eq(i),
					template = div.attr('template');
				if (template) {
					div.html($('script' + template).html() || '');
				}
			}
			inputs.trigger('change.tabs');
		}
	};
}