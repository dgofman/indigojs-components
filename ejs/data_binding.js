'use strict';

(function($, indigo) {
	indigo.info('Init Main');

	//Example 1.
	indigo.namespace('div[ex1]', function(ns) {
		var txt = ns.create('Text');
		indigo.watch({username: 'Admin', password: ''}, function(name, value, model) {
			txt.value = model.username + '/' + model.password;
		})
		.bind('username', {value: ns.create('Input', 0)})
		.bind('password', {value: ns.create('Input', 1)}).trigger('keydown keyup');
	});


	//Example 2.
	var model = {sharedValue: 'Hello IndigoJS'},
		Input = indigo.import('Input');

	indigo.namespace('div[ex2]', function(ns) {
		var txt1 = ns.create('Text'),
			ipt1 = ns.create(Input),
			ipt2 = ns.create(Input, 1),
			ipt3 = ns.create(Input, '#ext2_input');

		indigo.bind('sharedValue', [{value: txt1}, {value: ipt1}, {value: ipt2}, {value: ipt3}], model).trigger('keydown keyup');
	});


	//Example 3.
	indigo.import('Text', 'Input', 'Switch', 'Checkbox', function(Text, Input, Switch, Checkbox) {
		var chars = [],
			ns = indigo.namespace('div[ex3]'),
			txt = ns.create(Text),
			promise = indigo.watch({swhValue: true, chkValue: true}, function(name, value) {
				txt.value = 'Modified: <b>Name - </b>' + name + ', <b>Value - </b>' + value;
			});
		promise.bind('iptValue', 'value', ns.create(Input)).trigger('keydown keyup').watch(function(name, value, model, evt) {
			if (evt && evt.type === 'keydown') {
				var code = evt.which || evt.keyCode;
				if (code === 8) {
					chars.pop();
				} else {
					chars.push(String.fromCharCode(code));
				}
			}
			this.$input.val((value || '').replace(/./g, '*')); //mask value in component input box
			model[name] = chars.join(''); //assign actual value into model
		});
		promise.bind('swhValue', 'checked', ns.create(Switch));
		promise.bind('chkValue', 'checked', ns.create(Checkbox));
	});


		//Bind Dropdown selected index and input text
		/*  indigo.bind('selectedIndex', [{index: dpd}, {value: rng}]) //create and bind a new model
				//Bind Checkbox and Dropdown access
				.bind('disableDropdown', [{checked: chk}, {disabled: dpd}])
				//Bind Switch and Dropdown open/close popup menu
				.bind('popupDropdown', [{checked: sch}, {open: dpd}]);

		//Bind text values between Text, Input, Tooltip, Checkbox, Button, DropDown components
		indigo.bind('bindLabel', [{value: txt}, {value: int}, {value: tlt}, {label: chk}, {label: btn}, {prompt: dpd, $watch: function(name, value, model) {
			indigo.info('Dropdown name: ', name, ', value: ', value, ' model: ', JSON.stringify(model));
			this.indexByText(value);
			this[name] = value;
		}}], model);
	});
/*
		Dropdown = indigo.import('Dropdown'), //import as single class
				imports = indigo.import('Input', 'Text', 'Tooltip'), //assign array of classes
				Input = imports[0], //input


		var ns = indigo.namespace('[ig-ns=check_switch]'),
			img = ns.create(indigo.import('Image')),
			txt = ns.create(indigo.import('Text')),
			chk = ns.create(Checkbox),
			sch = ns.create(Switch),
			btn = ns.create(Button, 1); //Create component by using order index
			txt = ns.create(imports[1]), //text
				tlt = ns.create(imports[2]); //tooltip

		btn.click = function() {
			alert('Hello World');
		};

		//Bind url value of Image component and Text
		indigo.bind('imageUrl', [{url: img}, {text: txt, $watch: function(name, value) {
			this.value = '<a href=#>' + value + '</a>';
		}}], model);

		img.url = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';

		//Bind Switch and Checkbox state with Button access and editable Text
		indigo.bind('bindState', [{checked: chk}, {checked: sch}, {editable: txt}, {disabled: btn, $watch: function(name, value) {
			this[name] = !value;
		}}], model);
	});*/
})(window.$, window.indigoJS);