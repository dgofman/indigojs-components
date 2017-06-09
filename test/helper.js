'use strict';

test(function(module, assert, indigoJS) {
	var win = {},
		Helper = module(win),
		helper = Helper(indigoJS);

	win.top = {
		location: {}
	};

	assert(helper.redirect('/foo'), '/indigojs/foo', 'helper.redirect string');
	assert(helper.redirect(['/foo', '/v1', '/v2', '/v3']), '/indigojs/foo/v1/v2/v3', 'helper.redirect array');
	assert(helper.substitute('Hello, {0}! %NAME%.', '{0}', 'World', '%NAME%', 'Web App'), 'Hello, World! Web App.', 'helper.substitute');
	helper.scrollView({$el:[{scrollIntoView: function(){}}]});
});