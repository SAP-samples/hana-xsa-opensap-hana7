/*eslint no-console: 0, no-undef: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, no-use-before-define: 0, new-cap:0 */
'use strict';
var xsenv = require('@sap/xsenv');

module.exports = {

	getLocale: function (req) {
		let langparser = require("accept-language-parser");
		let lang = req.headers["accept-language"];
		if (!lang) {
			return null;
		}
		var arr = langparser.parse(lang);
		if (!arr || arr.length < 1) {
			return null;
		}
		var locale = arr[0].code;
		if (arr[0].region) {
			locale += "_" + arr[0].region;
		}
		return locale;
	},

	callback: function (error, res, message) {
		if (error) {
			res.writeHead(500, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: message
			}));
		} else {
			res.writeHead(200, {
				'Content-Type': 'application/json'
			});
			res.end(JSON.stringify({
				message: message
			}));
		}
	},
	appconfig: function () {
		var services = xsenv.getServices({
			jobscheduler: {
				tag: 'jobscheduler'
			}
		}).jobscheduler;
		return {
			timeout: 15000,
			user: services.user,
			password: services.password,
			baseURL: services.url
		};
	},
	isAlphaNumeric: function (str) {
		var code, i, len;
		for (i = 0, len = str.length; i < len; i++) {
			code = str.charCodeAt(i);
			if (!(code > 47 && code < 58) && // numeric (0-9)
				!(code > 64 && code < 91) && // upper alpha (A-Z)
				!(code > 96 && code < 123)) { // lower alpha (a-z)
				return false;
			}
		}
		return true;
	},
	isAlphaNumericAndSpace: function (str) {
		var res = str.match(/^[a-z\d\-_\s]+$/i);
		if (res) {
			return true;
		} else {
			return false;
		}
	},
	isValidDate: function (date) {
		console.log("date" + date);
		var timestamp = Date.parse(date);
		console.log("timsestamp" + timestamp);
		if (isNaN(timestamp) === true) {
			return false;
		}
		return true;
	}
};