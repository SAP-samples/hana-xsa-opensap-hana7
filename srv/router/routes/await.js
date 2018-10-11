/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */

//Promises Examples re-done in Node.js Version 8 Async/Await feature
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	const util = require("util");
	const readFilePromisified = util.promisify(require("fs").readFile);
	class promisedDB {
		constructor(client) {
			this.client = client;
			this.client.promisePrepare = util.promisify(this.client.prepare);
		}

		preparePromisified(query) {
			return this.client.promisePrepare(query);
		}

		statementExecPromisified(statement, parameters) {
			statement.promiseExec = util.promisify(statement.exec);
			return statement.promiseExec(parameters);
		}

		loadProcedurePromisified(hdbext, schema, procedure) {
			hdbext.promiseLoadProcedure = util.promisify(hdbext.loadProcedure);
			return hdbext.promiseLoadProcedure(this.client, schema, procedure);
		}

		callProcedurePromisified(storedProc, inputParams) {
			return new Promise((resolve, reject) => {
				storedProc(inputParams, (error, outputScalar, results) => {
					if (error) {
						reject(error);
					} else {
						resolve({
							outputScalar: outputScalar,
							results: results
						});
					}
				});
			});
		}
	}

	//Hello Router
	app.get("/", (req, res) => {
		var output =
			`<H1>Async/Await - Better Promises</H1></br>
			<a href="${req.baseUrl}/await">/await</a> - Await readFile</br>
			<a href="${req.baseUrl}/awaitError">/awaitError</a> - await readFile and catch error</br> 
			<a href="${req.baseUrl}/awaitDB1">/awaitDB1</a> - Simple HANA DB Select via Await</br>
			<a href="${req.baseUrl}/awaitDB2">/awaitDB2</a> - Simple Database Call Stored Procedure via Await</br>` +
			require(global.__base + "utils/exampleTOC").fill();
		return res.type("text/html").status(200).send(output);
	});

	//Await readFile
	app.get("/await", async(req, res) => {
		try {
			const text = await readFilePromisified(global.__base + "async/file.txt");
			return res.type("text/html").status(200).send(text);
		} catch (e) {
			console.log(e);
			return res.type("text/html").status(200).send(e.toString());
		}
	});

	//Await readFile and catch error
	app.get("/awaitError", async(req, res) => {
		try {
			const text = await readFilePromisified(global.__base + "async/missing.txt");
			return res.type("text/html").status(200).send(text);
		} catch (e) {
			return res.type("text/html").status(200).send(e.toString());
		}
	});

	//Simple Database Select Await
	app.get("/awaitDB1", async(req, res) => {
		try {
			let db = new promisedDB(req.db);
			const statement = await db.preparePromisified("select SESSION_USER from \"DUMMY\"");
			const results = await db.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				Objects: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	//Simple Database Call Stored Procedure via Await
	app.get("/awaitDB2", async(req, res) => {
		try {
			let db = new promisedDB(req.db);
			let hdbext = require("@sap/hdbext");
			const sp = await db.loadProcedurePromisified(hdbext, null, "get_po_header_data");
			const output = await db.callProcedurePromisified(sp, {});
			let result = JSON.stringify({
				EX_TOP_3_EMP_PO_COMBINED_CNT: output.results
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	return app;
};