'use strict';

define(['window'], function(win) {

	var defOps = {
		contentType: 'application/json',
		overlay: function() {},
		alert: function() {}
	};

	var _ = function(contextPath, options) {
		options = options || {};
		options.contextPath = contextPath;

		for (var key in defOps) {
			if (options[key] === undefined) {
				options[key] = defOps[key];
			}
		}

		var request = function(callback, path, data, type, contentType) {
			options.overlay(_.OVERLAY_SHOW);

			return win.top.$.ajax({
				type: type || 'GET',
				url: options.contextPath + path,
				data: data ? JSON.stringify(data) : null,
				contentType: contentType === undefined ? options.contentType : contentType,
				async: true,
				cache: false,
				processData: false,
				success: function(data, status, jqXHR) {
					options.overlay(_.OVERLAY_HIDE);
					callback(null, data, status, jqXHR);
				},
				error: function(jqXHR) {
					options.overlay(_.OVERLAY_HIDE);
					if (jqXHR.status === 302) {
						win.top.location.reload(true);
					} else if (jqXHR.status === 0 || jqXHR.status === 404) { //abort
						options.alert(jqXHR.responseJSON || jqXHR.responseText);
					} else {
						callback(jqXHR.responseJSON || jqXHR.responseText, null, jqXHR);
					}
				}
			});
		};

		return {
			options: options,

			request: request,

			get: function(callback, url) {
				return request(callback, url, null, 'GET');
			},

			post: function(callback, url, data) {
				return request(callback, url, data, 'POST');
			},

			put: function(callback, url, data) {
				return request(callback, url, data, 'PUT');
			},

			patch: function(callback, url, data) {
				return request(callback, url, data, 'PATCH');
			},

			delete: function(callback, url, data) {
				return request(callback, url, data, 'DELETE');
			},

			file: function(callback, url, data) {
				return request(callback, url, data, 'POST', false);
			}
		};
	};
	_.OVERLAY_HIDE = 0;
	_.OVERLAY_SHOW = 1;

	return _;
});