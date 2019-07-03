/*eslint no-console: 0*/
'use strict';

var xsjstest = require('@sap/xsjs-test');
var xsenv = require('@sap/xsenv');

var options = {
	test: {
		format: 'xml',
		pattern: '.*Test',
		reportdir: './reports',
		filename: 'report'
	},
	coverage: {
		reporting: {
			reports: ['json']
		},
		dir: './reports',
		filename: 'coverage-final.json'
	}
};

//configure HANA
try {
	options = Object.assign(
		options,
		xsenv.getServices({ hana: { tag: 'hana' } })
	);
} catch (err) {
	console.error(err);
}

// configure UAA
try {
	options = Object.assign(
		options,
		xsenv.getServices({ uaa: { tag: 'xsuaa' } })
	);
} catch (err) {
	console.error(err);
}

xsjstest(options).runTests();
