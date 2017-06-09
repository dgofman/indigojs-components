'use strict';

define(['./validate'], function(Validator) {

	var proto = Validator.prototype,
		_ = function(model) {
			Validator.call(this);
			this.model = model;
			this.super = function(api, args) {
				args = [this.model[args[0]]].concat(Array.prototype.slice.call(args, 1), args[0]);
				return proto[api].apply(this, args);
			}
		};
	_.prototype = {
		minmax: function(name, min, max) {
			return this.super('minmax', arguments);
		},

		str_minmax: function(name, min, max) {
			return this.super('str_minmax', arguments);
		},

		isset: function(name) {
			return this.super('isset', arguments);
		},

		empty: function(name) {
			return this.super('empty', arguments);
		}
	};
	for (var name in proto) {
		if (!_.prototype[name]) {
			_.prototype[name] = proto[name];
		}
	}

	return _;
});