/*jshint unused:false*/
function igoText($) {
	'use strict';

	return {
		init: function(el) {
			this.$label = $('>div>p', el);
		},

		value: {
			get: function() {
				return this.$label.html();
			},
			set: function(value) {
				this.$label.html(value);
			}
		},

		text: {
			get: function() {
				return this.$label.text();
			},
			set: function(value) {
				this.$label.text(value);
			}
		},

		editable: {
			get: function() {
				return this.$label.prop('contenteditable') === 'true';
			},
			set: function(value) {
				this.$label.prop('contenteditable', value);
			}
		}
	};
}