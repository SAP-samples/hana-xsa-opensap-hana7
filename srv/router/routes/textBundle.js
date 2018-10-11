/*eslint no-console: 0, no-unused-vars: 0, consistent-return: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var app = express.Router();
var os = require("os");
var TextBundle = require("@sap/textbundle").TextBundle;

module.exports = function() {

	app.get("/", (req, res) => {
		var bundle = new TextBundle(global.__base + "_i18n/messages", require(global.__base + "utils/util").getLocale(req));
		res.writeHead(200, {
			"Content-Type": "text/plain; charset=utf-8"
		});
		var greeting = bundle.getText("greeting", [os.hostname(), os.type()]);
		res.end(greeting, "utf-8");
	});
	return app;
};