'use strict';

define(['window', './validate'], function(win, Validate) {
	var _, $ = win.$;

	return _ = {
		validate: function(model, verifyByName) {
			return new Validate(model, verifyByName);
		},
	};
});