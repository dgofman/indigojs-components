'use strict';

(function(top) {
	var ig = top.indigoJS = top.indigoJS || {},
		eventModel = function(o) {
			var proto = Object.getPrototypeOf(o),
				events = proto.__events__;
			if (!events) {
				events = Object.defineProperty(proto, '__events__', {
					value: {},
					writable: true,
					enumerable: false
				}).__events__;
			}
			return events;
		},
		bindProperties = function(bindMap, callback) {
			for (var name in bindMap) {//find a bind property name
				if (name !== '$watch') {
					return callback({name: name, self: bindMap[name], $watch: bindMap.$watch});
				}
			}
		};

	ig.uid = function () {
		return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, function() {
			return (Math.random() * 16 | 0).toString(16);
		});
	};
	ig.import = function() {
		var callback, classes = [],
			length = arguments.length;
		if (typeof arguments[length - 1] === 'function') {
			callback = arguments[--length];
		}
		for (var i = 0; i < length; i++) {
			var className = arguments[i];
			if (className.charCodeAt(0) < 91) {
				className = 'igo' + className; //Button -> igoButton 
			}
			var factory = top[className];
			if (typeof factory !== 'function') {
				throw new Error('ClassNotFoundException: ' + className);
			}
			if (!factory.classInstance) {
				var selector = '[_=' + className + ']',
					apis = factory(window.$, selector, ig),
					clazz = function(el) {
						this.$el = el;
						this.init(el, this);
					};
				factory.classInstance = clazz;
				clazz.selector = selector;

				clazz.prototype.constructor = clazz;
				clazz.prototype.toString = function() {
					return selector + '::' + this.$el[0].outerHTML;
				};
				clazz.prototype.define = function(name, get, set) {
					var descriptor = {};
					if (get) { descriptor.get = get; }
					if (set) { descriptor.set = set; }
					Object.defineProperty(this, name, descriptor);
				};
				clazz.prototype.class = function(name, isAdd) {
					ig.class(this.$el, name, isAdd);
				};
				clazz.prototype.focus = function() {
					this.$el.focus();
				};
				clazz.prototype.onEvent = function(type, comp, intercept) {
					var _hanlder,
						uid = ig.uid();
					Object.defineProperty(this, type, {
						get: function() {
							return _hanlder;
						},
						set: function(hanlder) {
							comp.event(type + '.' + uid, _hanlder = hanlder);
							if (intercept) {
								intercept(hanlder, uid);
							}
						}
					});
				};
				clazz.prototype.init = function() {};

				if (!apis.disabled) {
					apis.disabled = {
						get: function() {
							return !!this.$el.attr('disabled');
						},
						set: function(value) {
							ig.attr(this.$el, 'disabled', value);
						}
					};
				}

				if (!apis.show) {
					apis.show = {
						get: function() {
							return (this.$el.length && this.$el[0].getClientRects().length > 0);
						},
						set: function(value) {
							value ? this.$el.show() : this.$el.hide();
						}
					};
				}

				for (var name in apis) {
					var descriptor = apis[name];
					if (descriptor && descriptor.set && descriptor.get) {
						descriptor.set = (function(set, type) {
							return function(value) {
								var events = eventModel(this);
								if (!events[type]) {
									events[type] = true;
									ig.info(type, value, this.toString());
									set.call(this, value);
									this.$el.trigger(type, [value]);
								}
								delete events[type];
							};
						})(descriptor.set, name);
						Object.defineProperty(clazz.prototype, name, descriptor);
					} else {
						clazz.prototype[name] = descriptor;
					}
				}
			}
			classes.push(factory.classInstance);
		}
		if (callback) {
			callback.apply(this, classes);
		} else {
			return classes.length === 1 ? classes[0] : classes;
		}
	};
	ig.create = function(clazz, idxOrSelector, parent) {
		parent = parent || window.$('body');
		if (typeof clazz === 'string') {
			clazz = this.import(clazz);
		}
		var el, els = parent.find(clazz.selector),
			type = typeof(idxOrSelector);
		if (type === 'number') {
			el = els.eq(idxOrSelector);
		} else if (type === 'string') {
			el = els.filter(idxOrSelector);
		} else {
			el = els.eq(0);
		}
		return new clazz(el);
	};
	ig.namespace = function(selector, callbak) {
		var self = this,
			parent = window.$(selector),
			ns = {
				create: function(clazz, idxOrSelector) {
					return self.create.call(self, clazz, idxOrSelector, parent);
				}
			};
		if (callbak) { callbak(ns); }
		return ns;
	};
	ig.watch = function(model, handler) {
		var self = this, ref;
		return ref = {
			handler: handler || function() {},
			bind: function(name, bindMap) {
				if (typeof bindMap  === 'string') { //bind property name
					model[name] = model[name] || null;
					var map = {};
					map[bindMap] = arguments[2];
					if (typeof arguments[3] === 'function') {
						map['$watch'] = arguments[3];
					}
					bindMap = map;
				}
				return self.bind(name, bindMap, model, function() {
					ref.handler.apply(self, arguments);
				});
			}
		};
	};
	ig.bind = function(name, bindMap, model) {
		model = model || {};
		if (!Array.isArray(bindMap)) { //single bind
			bindMap = [bindMap];
		}
		for (var i = 0; i < bindMap.length; i++) {
			bindProperties(bindMap[i], function(o) {
				o.self.$el.on(o.name, function(e, value) {
					model[name] = value;
					if (o.$watch) {
						if (o.self[o.name] !== value) {
							o.$watch.call(o.self, o.name, value, model);
						}
					}
				});
			});
		}

		var self = this,
			watch = arguments[3],
			val = model[name];
		Object.defineProperty(model, name, {
			get: function() {
				return val;
			},
			set: function(value) {
				val = value;
				var events = eventModel(model);
				if (!events[name]) {
					events[name] = true;
					for (i = 0; i < bindMap.length; i++) {
						bindProperties(bindMap[i], function(o) {
							if (o.$watch) {
								o.$watch.call(o.self, o.name, value, model);
							} else {
								o.self[o.name] = value;
							}
						});
					}
					if (watch && model[name] !== undefined) {
						watch(name, value);
					}
					delete events[name];
				}
			}, enumerable: true
		});
		model[name] = val;

		return {
			bind: function(name, bindMap, newModel) {
				return self.bind(name, bindMap, newModel || model, watch);
			}
		};
	};
})(window.top);