'use strict';

define(['./errcode'], function(ErrCode) {

	var _ = function(model) {
		this.model = model;
		this.errors = [];
	};
	_.prototype = {
		addError: function(name, code, details) {
			this.errors.push(new ErrCode(name, code, details));
			return false;
		},

		isValid: function() {
			return this.errors.length === 0;
		},

		isError: function() {
			return this.errors.length !== 0;
		},

		getErrors: function() {
			return this.errors;
		},

		reset: function() {
			this.errors.length = 0;
			return this;
		},

		/**
		 * @param {String} name The model property name.
		 * @param {Number} [min] Minimum length allowed for model value.
		 * @param {Number} [max] Maximum length allowed for model value.
		 * @return {Boolean} Return true is valid otherwise false.
		*/
		minmax: function(name, min, max) {
			var val = this.model[name];
			if (typeof val !== 'string') {
				return this.addError(name, ErrCode.INVALID_TYPE);
			}
			val = val.trim();
			if (val.length < min) {
				return this.addError(name, ErrCode.INVALID_MIN_LENGTH);
			}
			if (max && val.length > max) {
				return this.addError(name, ErrCode.INVALID_MAX_LENGTH);
			}
			return true;
		}
	};
	return _;
});