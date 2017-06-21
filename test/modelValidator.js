'use strict';

test(function(module, ErrCode, Validator, assert) {
	var modelValidator = module(Validator),
		valObj = new modelValidator({val1: 'hellowrold', val2: 0, val3: 6, val4: 3, 
			val5: null, val6: 'h', val7: 'hello', val8: ''});

	assert(valObj.errors.length, 0, 'validate errors');

	assert(valObj.minmax('val1', 2, 5), false, 'invalid minmax');
	assert(String(valObj.errors[0].value), String(NaN), 'invalid minmax value');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid minmax code');
	assert(valObj.isValid(), false, 'isValid false');
	assert(valObj.isError(), true, 'isError true');
	assert(valObj.getErrors().length, 1, 'getErrors count');
	assert(valObj.reset().errors.length, 0, 'reset errors');

	assert(valObj.minmax('val2', 2, 5), false, 'validate min condition');
	assert(valObj.errors[0].code, ErrCode.INVALID_MIN, 'min condition code');
	valObj.reset();

	assert(valObj.minmax('val3', 2, 5), false, 'validate max condition');
	assert(valObj.errors[0].code, ErrCode.INVALID_MAX, 'max condition code');
	valObj.reset();

	assert(valObj.minmax('val4', 2, 5), true, 'valid minmax condition');
	assert(valObj.errors.length, 0, 'minmax errors.length');
	valObj.reset();

	assert(valObj.str_minmax('val5', 2, 5), false, 'invalid str_minmax');
	assert(valObj.errors[0].value, null, 'invalid str_minmax value');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid str_minmax code');
	valObj.reset();

	assert(valObj.str_minmax('val6', 2, 5), false, 'validate str_minmax INVALID_MIN');
	assert(valObj.errors[0].code, ErrCode.INVALID_MIN, 'str_minmax INVALID_MIN');
	valObj.reset();

	assert(valObj.str_minmax('val1', 2, 5), false, 'validate str_minmax INVALID_MAX');
	assert(valObj.errors[0].code, ErrCode.INVALID_MAX, 'str_minmax INVALID_MAX');
	valObj.reset();

	assert(valObj.str_minmax('val7', 2, 5), true, 'valid str_minmax');
	assert(valObj.errors.length, 0, 'str_minmax errors.length');
	valObj.reset();

	assert(valObj.isset('val5'), false, 'isset false');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'invalid isset code');
	valObj.reset();

	assert(valObj.isset('val8'), true, 'isset true');
	assert(valObj.errors.length, 0, 'isset errors.length');
	valObj.reset();

	assert(valObj.empty('val8'), false, 'empty false');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'empty string INVALID_VALUE');
	valObj.reset();

	assert(valObj.empty('val5'), false, 'empty as null');
	assert(valObj.errors[0].code, ErrCode.INVALID_VALUE, 'empty INVALID_VALUE');
	valObj.reset();

	assert(valObj.empty('val2'), false, 'empty invalid type');
	assert(valObj.errors[0].code, ErrCode.INVALID_TYPE, 'empty INVALID_TYPE');
	valObj.reset();

	assert(valObj.empty('val1'), true, 'value helloworld');
	assert(valObj.errors.length, 0, 'empty errors.length');
	valObj.reset();
});