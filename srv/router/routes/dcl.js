/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */

//Promises Examples re-done in Node.js Version 8 Async/Await feature
"use strict";
var express = require("express");

module.exports = function () {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output =
			`<H1>CDS DCL Examples</H1></br>
			<a href="${req.baseUrl}/salesorder">/salesorder</a> -Access Sales Order View via DCL</br>
			<a href="${req.baseUrl}/userinfo">/userinfo</a> - DCL User Info</br> ` +
			require(global.__base + "utils/exampleTOC").fill();
		return res.type("text/html").status(200).send(output);
	});

	app.get("/salesorder", async(req, res) => {
		try {
			let dbPromises = require(global.__base + "utils/dbPromises");
			let db = new dbPromises(req.db);
			const statement = await db.preparePromisified(
				`SELECT * 
			       FROM "SO.salesOrderView"`);
			const results = await db.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				salesorders: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	//Security Context via Passport
	app.get("/userinfo", (req, res) => {
		res.type("application/json").status(200).send(JSON.stringify(req.authInfo));
	});

	app.get("/userinfo2", async(req, res) => {
		try {
			let dbPromises = require(global.__base + "utils/dbPromises");
			let db = new dbPromises(req.db);
			const statement = await db.preparePromisified(
				`SELECT TOP 1 CURRENT_USER, SESSION_USER, SESSION_CONTEXT('XS_APPLICATIONUSER') as APPLICATION_USER,  SESSION_CONTEXT('APPLICATION') as APPLICATION, SESSION_CONTEXT('XS_COUNTRY') as XS_COUNTRY
				   FROM DUMMY`);
			const results = await db.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				"hdbCurrentUser": results,
				"user": req.user
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});
	return app;
};