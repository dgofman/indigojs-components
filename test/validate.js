'use strict';

test(function(module, ErrCode, assert) {
	var Validate = module(ErrCode),
		valObj = new Validate();

	assert(valObj.errors.length, 0, 'validate errors');

	assert(valObj.minmax('helloworld', 2, 5), false, 'invalid minmax');
	assert(String(valObj.errors[0].value), String(NaN), 'invalid minmax value');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid minmax code');
	assert(valObj.isValid(), false, 'isValid false');
	assert(valObj.isError(), true, 'isError true');
	assert(valObj.getErrors().length, 1, 'getErrors count');
	assert(valObj.reset().errors.length, 0, 'reset errors');

	assert(valObj.minmax(0, 2, 5), false, 'validate min condition');
	assert(valObj.errors[0].code, ErrCode.INVALID_MIN, 'min condition code');
	valObj.reset();

	assert(valObj.minmax(6, 2, 5), false, 'validate max condition');
	assert(valObj.errors[0].code, ErrCode.INVALID_MAX, 'max condition code');
	valObj.reset();

	assert(valObj.minmax(3, 2, 5), true, 'valid minmax condition');
	assert(valObj.errors.length, 0, 'minmax errors.length');
	valObj.reset();

	assert(valObj.str_minmax(null, 2, 5), false, 'invalid str_minmax');
	assert(valObj.errors[0].value, null, 'invalid str_minmax value');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid str_minmax code');
	valObj.reset();

	assert(valObj.str_minmax('h', 2, 5), false, 'validate str_minmax INVALID_MIN');
	assert(valObj.errors[0].code, ErrCode.INVALID_MIN, 'str_minmax INVALID_MIN');
	valObj.reset();

	assert(valObj.str_minmax('hellowrold', 2, 5), false, 'validate str_minmax INVALID_MAX');
	assert(valObj.errors[0].code, ErrCode.INVALID_MAX, 'str_minmax INVALID_MAX');
	valObj.reset();

	assert(valObj.str_minmax('hello', 2, 5), true, 'valid str_minmax');
	assert(valObj.errors.length, 0, 'str_minmax errors.length');
	valObj.reset();

	assert(valObj.isset(null), false, 'isset false');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid isset code');
	valObj.reset();

	assert(valObj.isset(''), true, 'isset true');
	assert(valObj.errors.length, 0, 'isset errors.length');
	valObj.reset();

	assert(valObj.empty(''), true, 'empty true');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid empty code');
	valObj.reset();

	assert(valObj.empty('helloworld'), false, 'empty false');
	assert(valObj.errors.length, 0, 'empty errors.length');
	valObj.reset();

	//assert(valObj.str_minmax('username', 2, 5), true, 'validate valid condition');
});