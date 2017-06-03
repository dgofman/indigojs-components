'use strict';

(function(top) {
	var ig = top.indigoJS = top.indigoJS || {},
		stateModel = function(o) {
			var states = o.__states__;
			if (!states) {
				var value = {};
				states = Object.defineProperty(o, '__states__', {
					get: function() { return value; },
					set: function(val) { return value = val; },
					enumerable: false
				}).__states__;
			}
			return states;
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
			var type = arguments[i];
			if (type.charCodeAt(0) < 91) {
				type = 'igo' + type; //Button -> igoButton 
			}
			var factory = top[type];
			if (typeof factory !== 'function') {
				throw new Error('ClassNotFoundException: ' + type);
			}
			if (!factory.classInstance) {
				var selector = '[_=' + type + ']',
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
						descriptor.set = (function(set, propName) {
							return function(value) {
								var states = stateModel(this);
								if (!states[propName]) {
									states[propName] = true;
									ig.info(propName, value, this.toString());
									set.call(this, value);
									this.$el.trigger(propName, [value]);
								}
								delete states[propName];
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
			return classes[0];
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
		var states = stateModel(model);
		bindMap.forEach(function(map) {
			bindProperties(map, function(o) {
				o.self.$el.on(o.name, function(e, value) {
					if (!states[name]) {
						model[name] = value;
						if (o.$watch) {
							if (o.self[o.name] !== value) {
								o.$watch.call(o.self, o.name, value, model);
							}
						}
					}
				});
			});
		});

		var self = this,
			watch = arguments[3],
			val = model[name];
		Object.defineProperty(model, name, {
			get: function() {
				return val;
			},
			set: function(value) {
				var fire = (val !== value);
				val = value;
				var states = stateModel(model);
				if (!states[name]) {
					states[name] = true;
					bindMap.forEach(function(map) {
						bindProperties(map, function(o) {
							if (o.$watch) {
								o.$watch.call(o.self, name, value, model);
							} else {
								o.self[o.name] = value;
							}
						});
					});
					if (watch && fire) {
						watch(name, value, model);
					}
					delete states[name];
				}
			}, enumerable: true
		});
		model[name] = val;

		return {
			bind: function(name, bindMap, newModel) {
				return self.bind(name, bindMap, newModel || model, watch);
			},
			trigger: function(events, prop, el) {
				bindMap.forEach(function(map) {
					bindProperties(map, function(o) {
						(el || o.self.$el).on(events, function(e) {
							if (map.$watch) {
								map.$watch.call(o.self, name, o.self[prop || o.name], model, e);
							} else {
								model[name] = o.self[prop || o.name];
							}
						});
					});
				});
				return self.bind(name, bindMap, model, watch);
			},
			watch: function(callback) {
				bindMap.forEach(function(map) {
					map.$watch = callback;
				});
				return self.bind(name, bindMap, model, watch);
			}
		};
	};
})(window.top);