'use strict';

/*jshint unused:false*/
function juiRadio($) {

	return {
		preinit: function(el) {
			$('>input', el).checkboxradio();
		}
	};
}