'use strict';

test(function(module, assert) {

	var DateFormat = module(),
		df = DateFormat(),
		date = new Date(2006, 5, 4, 3, 2, 1);
	assert(df.locale.dateFormat, 'M/d/yy', 'locale dateFormat');
	assert(df.locale.timeFormat, 'h:mm a', 'locale timeFormat');
	assert(df.locale.timeLongFormat, 'hh:mm a', 'locale timeLongFormat');
	assert(df.locale.dateTimeFormat, 'M/d/yy h:mm a', 'locale dateTimeFormat');
	assert(df.locale.dateTimeLongFormat, 'MM/dd/yyyy hh:mm a', 'locale dateTimeLongFormat');
	assert(df.locale.days.join(), 'Sunday,Monday,Wednesday,Saturday,Wednesday,Monday,Sunday', 'locale days');
	assert(df.locale.months.join(), 'January,February,March,April,May,June,July,August,September,October,November,December', 'locale months');
	assert(df.locale.months_abr.join(), 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec', 'locale months_abr');
	assert(df.locale.time_am, 'AM', 'locale time_am');
	assert(df.locale.time_pm, 'PM', 'locale time_pm');
	assert(df.pad(2), '02', 'pad function');
	assert(df.pad(10), 10, 'pad function');

	var d = df.parse('2006-01', /(\d{4})-(\d{2})/);
	assert(d.toString(), new Date(2006, 0, 1).toString(), 'parse String argument and regExp');
	d = df.parse('2006-06-04', /(\d{4})-(\d{2})-(\d{2})/);
	d.setHours(3, 2, 1);
	assert(d.toString(), date.toString(), 'parse String argument and regExp');
	assert(df.parse('2006-06-04 03:02:01').toString(), date.toString(), 'parse String argument');
	assert(df.parse(date.getTime()).toString(), date.toString(), 'parse Number argument');
	assert(df.parse(date).toString(), date.toString(), 'parse Date argument');
	assert(df.parse(null), null, 'parse null argument');
	assert(df.parse('2006-06-04'), null, 'invalid default parse format');

	assert(df.format(date), '6/4/06 3:02 AM', 'format function');
	assert(df.format(date, 'dateFormat'), '6/4/06', 'format dateFormat argument');
	assert(df.format(date, 'timeFormat'), '3:02 AM', 'format timeFormat argument');
	assert(df.format(date, 'timeLongFormat'), '03:02 AM', 'format timeLongFormat argument');
	assert(df.format(date, 'dateTimeFormat'), '6/4/06 3:02 AM', 'format dateTimeFormat argument');
	assert(df.format(date, 'dateTimeLongFormat'), '06/04/2006 03:02 AM', 'format dateTimeLongFormat argument');
	assert(df.format(date, 'HH:mm:ss MM/dd/yyyy'), '03:02:01 06/04/2006', 'format date-format argument');

	d = new Date(date);
	d.setHours(15, 16, 17);
	assert(df.format(d, 'EEEE EEE dd d MMMM MMM MM M yyyy yyy YY Y hh h HH H mm m ss s a'), 'Sunday Sun 04 4 June Jun 06 6 2006 2006 06 2006 03 3 15 15 16 16 17 17 PM', 'custom date-format');

	df.locale.days.length = 0;
	assert(df.format(d, 'EEE'), '', 'empty locale days');

	df = DateFormat({
		days: ['Sunday'],
		months: [null, null, null, null, null, 'June'],
		dateTimeLongFormat: 'EEEE, MMMM dd, yyyy HH:mm a',
		time_pm: 'PM',
		time_am: 'AM'
	});
	assert(df.locale.days.join(), 'Sunday', 'custom locale days');
	assert(df.locale.months.join(), ',,,,,June', 'custom locale months');
	assert(df.locale.dateTimeLongFormat, 'EEEE, MMMM dd, yyyy HH:mm a', 'custom locale dateTimeLongFormat');
	assert(df.locale.time_am, 'AM', 'custom locale time_am');
	assert(df.locale.time_pm, 'PM', 'custom locale time_pm');
	assert(df.format(date, 'dateTimeLongFormat'), 'Sunday, June 04, 2006 03:02 AM', 'custom locale dateTimeLongFormat');

});