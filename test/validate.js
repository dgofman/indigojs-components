'use strict';

test(function(module, ErrCode, assert) {
	var Validate = module(ErrCode),
		model = {'username': 'admin', 'password': '1'},
		valObj = new Validate(model);

	assert(valObj.model, model, 'validate model');
	assert(valObj.errors.length, 0, 'validate errors');

	assert(valObj.minmax('ssn', 2, 4), false, 'validate ssn property');
	assert(valObj.errors[0].name,'ssn', 'ssn property name');
	assert(valObj.errors[0].code, ErrCode.INVALID_TYPE, 'ssn property code');
	assert(valObj.isValid(), false, 'isValid false');
	assert(valObj.isError(), true, 'isError true');
	assert(valObj.getErrors().length, 1, 'getErrors count');
	assert(valObj.reset().errors.length, 0, 'reset errors');

	assert(valObj.minmax('password', 2, 4), false, 'validate password property');
	assert(valObj.errors[0].code, ErrCode.INVALID_MIN_LENGTH, 'password property code');
	assert(valObj.reset().errors.length, 0, 'reset errors');

	assert(valObj.minmax('username', 2, 4), false, 'validate username property');
	assert(valObj.errors[0].code, ErrCode.INVALID_MAX_LENGTH, 'username property code');
	assert(valObj.reset().errors.length, 0, 'reset errors');

	assert(valObj.minmax('username', 2, 5), true, 'validate valid condition');
});