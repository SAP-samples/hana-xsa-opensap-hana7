/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var async = require("async");

module.exports = function() {
	var app = express.Router();
	//Hello Router
	app.get("/Hi", (req, res) => {
		res.send("Hello World Node.js");
	});

	app.get("/getSessionInfo", (req, res) => {
		let body = JSON.stringify({
			"session": [{
				"UserName": req.user.id,
				"familyName": req.user.name.familyName,
				"givenName": req.user.name.givenName,
				"emails": req.user.emails,
				"Language": require(global.__base + "utils/util").getLocale(req)
			}]
		});
		return res.type("application/json").status(200).send(body);
	});
	
	return app;
};
