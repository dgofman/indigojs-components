/*jshint unused:false*/
function igoButton($) {
	'use strict';

	return {
		init: function(el) {
			this.$button = $('>button', el);
			this.onEvent('click', el);
		},

		label: {
			get: function() {
				return this.$button.html();
			},
			set: function(value) {
				this.$button.html(value);
			}
		}
	};
}