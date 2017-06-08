'use strict';

window.test = function(test) {
	window.define = function(rest, module) {
		test(module, function(actual, expected, message) {
			var b = actual === expected;
			window.document.write('<h4><font color="' + (b ? 'green' : 'red') + '">' + (b ? 'OK' : 'ERROR') + ' - ' + 
				message + (b ? '': '<br/>actual: ' + actual + '<br/>expected: ' + expected) + '</font><h4>');
		});
	};
};