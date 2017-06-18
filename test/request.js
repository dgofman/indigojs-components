'use strict';

test(function(module, assert) {
	var rest, ajax,
		basedURI = '/indigojs',
		win_top = {
			$: {
				ajax: function(opts) {
					return opts;
				}
			}
		},
		Request = module(win_top);

	assert(Request.OVERLAY_HIDE, 0, 'OVERLAY_HIDE');
	assert(Request.OVERLAY_SHOW, 1, 'OVERLAY_SHOW');
	assert(Request.OVERLAY_SHOW, 1, 'OVERLAY_SHOW');

	rest = Request(basedURI);
	assert(rest.options.contextPath, basedURI, 'validate contextPath');
	assert(rest.options.contentType, 'application/json', 'validate contentType');
	assert(typeof rest.options.overlay, 'function', 'validate overlay function');
	assert(typeof rest.options.alert, 'function', 'validate alert function');

	ajax = rest.request(null, '/foo', 'DATA');
	assert(ajax.type, 'GET', 'validate ajax.type');
	assert(ajax.url, basedURI + '/foo', 'validate ajax.url');
	assert(ajax.contentType, 'application/json', 'validate ajax.contentType');
	assert(ajax.data, '"DATA"', 'validate ajax.data');
	assert(ajax.processData, false, 'validate ajax.processData');
	assert(ajax.cache, false, 'validate ajax.cache');
	assert(ajax.async, true, 'validate ajax.async');

	ajax = rest.get(function(err, data, status, jqXHR) {
		assert(err, null, 'validate ex1.err');
		assert(data, 'DATA', 'validate ex1.data');
		assert(status, 'SUCCESS', 'validate ex1.status');
		assert(jqXHR, 'jqXHR', 'validate ex1.jqXHR');
	}, '/ex1');
	ajax.success('DATA', 'SUCCESS', 'jqXHR');

	ajax = rest.post(function() {}, '/ex2', {key: 'value'});
	win_top.location = {
		reload: function(b) {
			assert(b, true, 'ex2 - window.location.reload(true)');
		}
	};
	ajax.error({status: 302});

	ajax = rest.put(function() {}, '/ex3', {key: 'value'});
	ajax.error({status: 404, responseText: 'ERROR'});
	rest.options.alert = function(msg) {
		assert(msg, 'ex3 - ERROR', 'validate ex3.alert');
	};
	ajax.error({status: 404, responseText: 'ex3 - ERROR'});

	ajax = rest.patch(function(err, data, jqXHR) {
		assert(data, null, 'validate ex4.data');
		assert(err, 'ex4 - ERROR', 'validate ex4.err');
		assert(jqXHR.status, 500, 'validate ex4 jqXHR.status');
	}, '/ex4', {key: 'value'});
	ajax.error({status: 500, responseText: 'ex4 - ERROR'});

	ajax = rest.delete(function(err, data) {
		assert(err, null, 'validate ex5.err');
		assert(data, 'DELETED', 'validate ex5.data');
	}, '/ex5', {key: 'value'});
	ajax.success('DELETED');

	ajax = rest.file(function(err) {
		assert(err, null, 'validate ex6.err');
	}, '/ex6', {key: 'value'});
	ajax.success();

	rest = Request(basedURI, {contentType: 'text/html; charset=utf-8'});
	assert(rest.options.contextPath, basedURI, 'validate options contextPath');
	assert(rest.options.contentType, 'text/html; charset=utf-8', 'validate options contentType');
});