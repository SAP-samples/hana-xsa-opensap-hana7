/*eslint no-console: 0, no-undef: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, no-use-before-define: 0, new-cap:0 */
'use strict';
var xsenv = require('@sap/xsenv');

module.exports = {
	getAccessToken: function(req) {
		var accessToken = null;
		if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
		   accessToken =  req.headers.authorization.split(" ")[1];
		}
		return accessToken;
		
	}
};