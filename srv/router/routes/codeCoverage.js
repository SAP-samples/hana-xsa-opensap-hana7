/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */

//Promises Examples re-done in Node.js Version 8 Async/Await feature
"use strict";
var express = require("express");

function getMonitorClient() {
	return new Promise((resolve, reject) => {
		let hdb = require("@sap/hdbext");
		let xsenv = require("@sap/xsenv");
		let hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
			}
		});
		let pool = hdb.getPool(hanaOptions.hana);
		pool.acquire(null, (error, client) => {
			if (error) {
				reject(console.error(error));
			}
			if (client) {
				resolve(client);
			}
		});
	});
}

function execSQL(dbConn, sql) {
	return new Promise((resolve, reject) => {
		const dbClass = require(global.__base + "utils/dbPromises");
		let db = new dbClass(dbConn);
		db.preparePromisified(sql)
			.then(statement => {
				db.statementExecPromisified(statement, [])
					.then(results => {
						resolve(results);
					})
					.catch(err => {
						reject(err);
					});
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getConnectionId(dbConn) {
	return new Promise(async(resolve, reject) => {
		execSQL(dbConn, "SELECT SESSION_CONTEXT('CONN_ID') AS \"CONN_ID\" FROM \"DUMMY\"")
			.then(results => {
				resolve(results[0].CONN_ID);
			})
			.catch(err => {
				reject(err);
			});
	});
}

function activateCodeCoverage(dbConn, connId) {
	return execSQL(dbConn, `ALTER SYSTEM START SQLSCRIPT CODE COVERAGE FOR SESSION '${connId}'`);
}

function deactivateCodeCoverage(dbConn) {
	return execSQL(dbConn, "ALTER SYSTEM STOP SQLSCRIPT CODE COVERAGE");
}

function getCoverageResults(dbConn) {
	let coverageSQL = "SELECT * FROM M_SQLSCRIPT_CODE_COVERAGE_RESULTS";
	return execSQL(dbConn, coverageSQL);
}

function getCoverageObjectDefinitions(dbConn) {
	return execSQL(dbConn, "SELECT * FROM M_SQLSCRIPT_CODE_COVERAGE_OBJECT_DEFINITIONS");
}

function enableIndex(dbConn) {
	return execSQL(dbConn,
		`ALTER SYSTEM ALTER CONFIGURATION ('indexserver.ini','SYSTEM')
                             SET ('DEBUGGING_BACKEND','ENABLE_CODE_COVERAGE')='TRUE' WITH RECONFIGURE;`
	);
}

function enableSystem(dbConn) {
	return execSQL(dbConn,
		`ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM')
                             SET ('DEBUGGING_BACKEND','ENABLE_CODE_COVERAGE')='TRUE' WITH RECONFIGURE;`
	);
}

module.exports = function () {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output =
			`<H1>SQLScript Code Coverage </H1></br>
			<a href="${req.baseUrl}/build_products">/build_products</a> - Code Coverage of build_products</br> ` +
			require(global.__base + "utils/exampleTOC").fill();
		return res.type("text/html").status(200).send(output);
	});

	app.get("/build_products", async(req, res) => {
		try {
			let monitor = await getMonitorClient();
			let client = req.db;
			let hdbext = require("@sap/hdbext");

			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(client);
			let connId = await getConnectionId(db.client);
			await activateCodeCoverage(monitor, connId);
			let sp = await db.loadProcedurePromisified(hdbext, null, "build_products");
			let results = await db.callProcedurePromisified(sp, {});

			let coverageResults = await getCoverageResults(monitor);
			let coverageObj = await getCoverageObjectDefinitions(monitor);
			await deactivateCodeCoverage(monitor);

			let result = JSON.stringify({
				buildProducts: results,
				coverageResults: coverageResults,
				coverageObjectDefs: coverageObj,
				connId: connId
			});
			res.type("application/json").status(200).send(result);

		} catch (err) {
			res.type("text/plain").status(500).send(`${err.toString()}`);
		}

	});
	return app;
};