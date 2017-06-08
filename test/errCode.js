'use strict';

test(function(module, assert) {
	var err, ErrCode = module();
	err = new ErrCode('INVALID_TYPE', ErrCode.INVALID_TYPE);
	assert(err.name, 'INVALID_TYPE', 'INVALID_TYPE name');
	assert(err.code, 0, 'INVALID_TYPE code');

	err = new ErrCode('INVALID_MIN_LENGTH', ErrCode.INVALID_MIN_LENGTH);
	assert(err.name, 'INVALID_MIN_LENGTH', 'INVALID_MIN_LENGTH name');
	assert(err.code, 1, 'INVALID_MIN_LENGTH code');

	err = new ErrCode('INVALID_MAX_LENGTH', ErrCode.INVALID_MAX_LENGTH);
	assert(err.name, 'INVALID_MAX_LENGTH', 'INVALID_MAX_LENGTH name');
	assert(err.code, 2, 'INVALID_MAX_LENGTH code');
});