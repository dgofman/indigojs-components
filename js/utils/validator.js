'ue strict';

define(['./errcode'], function(ErrCode) {

	var proto, _ = function() {
		this.errors = [];
	};
	_.prototype = proto = {
		addError: function(value, code, name) {
			this.errors.push(new ErrCode(value, code, name));
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
		 * Retrieve min and max length of number.
		 * @param {Mixed} val The variable to be checked.
		 * @param {Number} [min] Minimum length allowed for model value.
		 * @param {Number} [max] Maximum length allowed for model value.
		 * @param {String} [name] Name of the field or variable.
		 * @return {Boolean} Return true is valid otherwise false.
		*/
		minmax: function(val, min, max, name) {
			val = parseFloat(val);
			if (isNaN(val)) {
				return this.addError(val, ErrCode.INVALID_VALUE, name);
			}
			if (val < min) {
				return this.addError(val, ErrCode.INVALID_MIN, name);
			}
			if (max && val > max) {
				return this.addError(val, ErrCode.INVALID_MAX, name);
			}
			return true;
		},

		/**
		 * Retrieve min and max length of string.
		 * @param {Mixed} val The variable to be checked.
		 * @param {Number} [min] Minimum length allowed for model value.
		 * @param {Number} [max] Maximum length allowed for model value.
		 * @param {String} [name] Name of the field or variable.
		 * @return {Boolean} Return true is valid otherwise false.
		*/
		str_minmax: function(val, min, max, name) {
			if (typeof val !== 'string') {
				return this.addError(val, ErrCode.INVALID_VALUE, name);
			}
			val = val.trim();
			if (val.length < min) {
				return this.addError(val, ErrCode.INVALID_MIN, name);
			}
			if (max && val.length > max) {
				return this.addError(val, ErrCode.INVALID_MAX, name);
			}
			return true;
		},

		/**
		 * Determine if a variable is set and is not NULL
		 * @param {Mixed} val The variable to be checked.
		 * @param {String} [name] Name of the field or variable.
		 * @return {Boolean} Return true is valid otherwise false.
		*/
		isset: function(val, name) {
			if (val === undefined || val === null) {
				return this.addError(val, ErrCode.INVALID_VALUE, name);
			}
			return true;
		},

		/**
		 * Determine whether a string is empty.
		 * @param {Mixed} val The variable to be checked.
		 * @param {String} [name] Name of the field or variable.
		 * @return {Boolean} Return true is valid otherwise false.
		*/
		empty: function(val, name) {
			if (!proto.isset.call(this, val, name) || !String(val).trim()) {
				return !this.addError(val, ErrCode.INVALID_VALUE, name);
			}
			return false;
		}
	};
	return _;
});