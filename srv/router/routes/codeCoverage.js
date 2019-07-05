/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, quotes:0 */
/*eslint-env node, es6 */

"use strict";
var express = require("express");


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
			let cCover = require(global.__base + "utils/coverage");
			let monitor = await cCover.getMonitorClient();
			let client = req.db;
			let hdbext = require("@sap/hdbext");

			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(client);
			let connId = await cCover.getConnectionId(db.client);
			await cCover.activateCodeCoverage(monitor, connId);

			let sp = await db.loadProcedurePromisified(hdbext, null, "build_products");
			let results = await db.callProcedurePromisified(sp, {});
			let debugSessions = await cCover.getDebugSessions(monitor);
			let debugConnections = await cCover.getDebugConnections(monitor);

			let coverageResults = await cCover.getCoverageResults(monitor);
			let coverageObj = await cCover.getCoverageObjectDefinitions(monitor);
			let prettyResults = await cCover.getCoveragePretty(monitor, coverageObj[0].OBJECT_DEFINITION_ID);
			await cCover.deactivateCodeCoverage(monitor);

			let result = JSON.stringify({
				buildProducts: results,
				coverageResults: cCover.escapeHTML(prettyResults.outputScalar.RESULTSTRING.toString("utf8")),
				connId: connId,
				debugSessions: debugSessions,
				debugConnections: debugConnections
			});
			//res.type("application/json").status(200).send(result);
			res.type("text/html").status(200).send(cCover.escapeHTML(prettyResults.outputScalar.RESULTSTRING.toString("utf8")));

		} catch (err) {
			res.type("text/plain").status(500).send(`${err.toString()}`);
		}

	});
	return app;
};