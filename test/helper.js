'use strict';

test(function(module, assert) {
	var helper = module();

	assert(helper.substitute('Hello, {0}! %NAME%.', '{0}', 'World', '%NAME%', 'Web App'), 'Hello, World! Web App.', 'helper.substitute');
	helper.scrollView({$el:[{scrollIntoView: function(){}}]});
});