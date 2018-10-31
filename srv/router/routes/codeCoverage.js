/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, quotes:0 */
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
	var codeCoverageSQL =
		` SELECT DISTINCT START_POSITION, END_POSITION, SUM(HIT_COUNT) AS HIT_COUNT FROM M_SQLSCRIPT_CODE_COVERAGE_RESULTS
           GROUP BY START_POSITION, END_POSITION
           ORDER BY START_POSITION DESC, END_POSITION DESC`;
	return execSQL(dbConn, codeCoverageSQL);
}

function getCoverageObjectDefinitions(dbConn) {
	return execSQL(dbConn, "SELECT * FROM M_SQLSCRIPT_CODE_COVERAGE_OBJECT_DEFINITIONS");
}

function getCoveragePretty(dbConn, oId) {
	return new Promise(async(resolve, reject) => {
		try {
			let hdbext = require("@sap/hdbext");
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(dbConn);
			let sp = await db.loadProcedurePromisified(hdbext, null, "code_coverage_pretty");
			let results = (await db.callProcedurePromisified(sp, {
				"OBJECTDEFINITIONID": oId
			}));
			resolve(results);
		} catch (err) {
			reject(err);
		}
	});
}

function getDebugSessions(dbConn) {
	return execSQL(dbConn, "SELECT * FROM M_DEBUG_SESSIONS");
}

function getDebugConnections(dbConn) {
	return execSQL(dbConn, "SELECT * FROM M_DEBUG_CONNECTIONS");
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

function escapeHTML(coverageString) {
	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}
	coverageString = coverageString.replace(new RegExp(`\n`, "g"), `<br>`);
	coverageString = coverageString.replace(new RegExp(`\r`, "g"), `<br>`);	
	coverageString = coverageString.replace(new RegExp(" ", "g"), `&nbsp;`);
	
	coverageString = coverageString.replace(new RegExp("starthitpre", "g"), "<span class=\"hitpre\">");
	coverageString = coverageString.replace(new RegExp(`starthit`, "g"), `</span><span class="hit">`);
	coverageString = coverageString.replace(new RegExp(`starthisuf`, "g"), `</span><span class="hitsuf">`);
	coverageString = coverageString.replace(new RegExp(`stophit`, "g"), `</span>`);
	coverageString = coverageString.replace(new RegExp(`startmisspre`, "g"), `<span class="misspre">`);
	coverageString = coverageString.replace(new RegExp(`startmiss`, "g"), `</span><span class="miss">`);
	coverageString = coverageString.replace(new RegExp(`startmiuf`, "g"), `</span><span class="misssuf">`);
	coverageString = coverageString.replace(new RegExp(`stopmiss`, "g"), `</span>`);

	coverageString = `<html>
  <head>
    <style type="text/css">
      p {
        font-size:14px;
        color:#000000;
      }
      .hit{
        background-color: #aaddaa;
        font-weight:bold;
      }
      .hitpre{
        background-color: #66bb66;
        font-weight:bold;
      }
      .hitsuf{
        background-color: #66bb66;
        font-weight:bold;
      }
      .miss{
        background-color: #ffaaaa;
        font-weight:bold;
      }
      .misspre{
        background-color: #bb6666;
        font-weight:bold;
      }
      .misssuf{
        background-color: #bb6666;
        font-weight:bold;
      }
      .box {
        background-color: orange;
      }
    </style>
  </head>
  <body>
    <p> ${coverageString} </p>
  </body>
</html>`;
	return coverageString;
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
			let debugSessions = await getDebugSessions(monitor);
			let debugConnections = await getDebugConnections(monitor);

			let coverageResults = await getCoverageResults(monitor);
			let coverageObj = await getCoverageObjectDefinitions(monitor);
			let prettyResults = await getCoveragePretty(monitor, coverageObj[0].OBJECT_DEFINITION_ID);
			await deactivateCodeCoverage(monitor);

			let result = JSON.stringify({
				buildProducts: results,
				coverageResults: escapeHTML(prettyResults.outputScalar.RESULTSTRING.toString("utf8")),
				//	coverageObjectDefs: coverageObj,
				connId: connId,
				debugSessions: debugSessions,
				debugConnections: debugConnections
			});
			//res.type("application/json").status(200).send(result);
			res.type("text/html").status(200).send(escapeHTML(prettyResults.outputScalar.RESULTSTRING.toString("utf8")));

		} catch (err) {
			res.type("text/plain").status(500).send(`${err.toString()}`);
		}

	});
	return app;
};