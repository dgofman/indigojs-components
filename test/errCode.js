'use strict';

test(function(module, assert) {
	var err, ErrCode = module();
	err = new ErrCode('INVALID_VALUE', ErrCode.INVALID_VALUE, 'username');
	assert(err.value, 'INVALID_VALUE', 'INVALID_VALUE value');
	assert(err.code, 0, 'INVALID_VALUE code');
	assert(err.name, 'username', 'INVALID_VALUE name');

	err = new ErrCode('INVALID_MIN', ErrCode.INVALID_MIN);
	assert(err.value, 'INVALID_MIN', 'INVALID_MIN value');
	assert(err.code, 1, 'INVALID_MIN code');

	err = new ErrCode('INVALID_MAX', ErrCode.INVALID_MAX);
	assert(err.value, 'INVALID_MAX', 'INVALID_MAX value');
	assert(err.code, 2, 'INVALID_MAX code');
});