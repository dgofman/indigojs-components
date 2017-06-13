'use strict';

function igoDialog($, selector, ig) {

	return {
		preinit: function(el) {
			var ref = this.initForms(el, {});

			if (ref.$header.attr('uid')) {
				ref.$header.html($(ref.$header.attr('uid')).html());
			}
			if (ref.$section.attr('uid')) {
				ref.$section.html($(ref.$section.attr('uid')).html());
			}
			if (ref.$footer.attr('uid')) {
				ref.$footer.html($(ref.$footer.attr('uid')).html());
			}

			el.find('.close').event('click.hide', function() {
				el.hide();
				el.trigger('close');
			});

			$('[_]', el).each(function(i, dom) {
				var el = $(dom);
				ig.preinit($, el.attr('_'), el);
			});

			$('*[dialog_id="' + el.attr('id') + '"]').event('click.show', function() {
				el.show();
			});
		},

		initForms: function(el, ref) {
			ref.$header = $('>div>header', el);
			ref.$section = $('>div>section', el);
			ref.$footer = $('>div>footer', el);
			return ref;
		},

		init: function(el) {
			this.initForms(el, this);
			this.onEvent('close', el);
			this.defaultTitle = this.$header.find('.title').html();
			this.defaultContent = this.$section.find('.content').html();
		},

		title: {
			get: function() {
				return this.$header.find('.title').html();
			},
			set: function(value) {
				return this.$header.find('.title').html(value);
			}
		},

		content: {
			get: function() {
				return this.$section.find('.content').html();
			},
			set: function(value) {
				return this.$section.find('.content').html(value);
			}
		},

		show: {
			get: function() {
				return this.$el.css('display') !== 'none';
			},
			set: function(value) {
				this.$el.css('display', value ? 'block' : 'none');
				if (value) {
					this.$section.find('input, textarea').eq(0).focus();
				} else {
					this.$el.trigger('close');
				}
			}
		}
	};
}
igoDialog.register = null;