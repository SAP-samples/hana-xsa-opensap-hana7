/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	app.get("/", (req, res) => {
		res.type("application/json").status(200).send("Authorizations Demo");
	});
	
	//Security Context via Passport
	app.get("/passport", (req, res) => {
		res.type("application/json").status(200).send(JSON.stringify(req.authInfo));
	});

	//Build the Security Context Via XSSEC
	app.get("/xssec", (req, res) => {
		let xssec = require("@sap/xssec");
		let xsenv = require("@sap/xsenv");
		let accessToken;

		function getAccessToken(req) {
			var accessToken = null;
			if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
				accessToken = req.headers.authorization.split(" ")[1];
			}
			return accessToken;
		}
		
		accessToken = getAccessToken(req);
		let uaa = xsenv.getServices({
			uaa: {
				tag: "xsuaa"
			}
		}).uaa;
		xssec.createSecurityContext(accessToken, uaa, function(error, securityContext) {
			if (error) {
				console.log("Security Context creation failed");
				return;
			}
			console.log("Security Context created successfully");
			res.type("application/json").status(200).send(JSON.stringify(securityContext));

		});
	});
	return app;
};