'use strict';

let passing = [],
	failing = [],
	moduleName,
	assert = (actual, expected, message) => {
		const b = actual === expected;
		if (b) {
			passing.push(message);
			console.log(' \x1b[32m%s\x1b[0m', '√ \x1b[90m' + message);
		} else {
			failing.push([moduleName + ' ' + message, actual, expected]);
			console.error(' \x1b[31m%s\x1b[0m', failing.length + ') ' + message);
		}
	}, include = (path) => {
		path = require.resolve(path);
		delete require.cache[path];
		require(path);
	};

var describe = (name, callback) => {
	moduleName = name;
	console.log('\n' + name);
	callback();
};

describe('Should test dateFormat', () => {
	global.test = (test) => {
		global.define = (rest, module) => {
			test(module, assert);
		};
		include('../js/utils/dateFormat.js');
	};
	include('./dateFormat.js');
});

describe('Should test errCode', () => {
	global.test = (test) => {
		global.define = (rest, module) => {
			test(module, assert);
		};
		include('../js/utils/errcode.js');
	};
	include('./errCode.js');
});

describe('Should test validate', () => {
	global.define = (rest, module) => {
		var ErrCode = module();
		global.test = (test) => {
			global.define = (rest, module) => {
				test(module, ErrCode, assert);
			};
			include('../js/utils/validate.js');
		};
		include('./validate.js');
	};
	include('../js/utils/errcode.js');
});

describe('Should test request', () => {
	global.test = (test) => {
		global.define = (rest, module) => {
			test(module, assert, {});
		};
		include('../js/utils/request.js');
	};
	include('./request.js');
});



console.log('\n\n  \x1b[32m%s\x1b[0m', passing.length + ' passing');
console.log('  \x1b[31m%s\x1b[0m', failing.length + ' failing');
failing.forEach((err, index) => {
	console.log('\n ' + (index + 1) + ') ' + err[0]);
	console.log(' \x1b[31m%s\x1b[0m', 'actual: ' + err[1] + '\n expected: ' + err[2]);
});