/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, quotes:0 */
/*eslint-env node, es6 */

"use strict";

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

module.exports = {

	getMonitorClient: () => {
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
	},

	getConnectionId: (dbConn) => {
		return new Promise(async(resolve, reject) => {
			execSQL(dbConn, "SELECT SESSION_CONTEXT('CONN_ID') AS \"CONN_ID\" FROM \"DUMMY\"")
				.then(results => {
					resolve(results[0].CONN_ID);
				})
				.catch(err => {
					reject(err);
				});
		});
	},

	activateCodeCoverage: (dbConn, connId) => {
		return execSQL(dbConn, `ALTER SYSTEM START SQLSCRIPT CODE COVERAGE FOR SESSION '${connId}'`);
	},

	deactivateCodeCoverage: (dbConn) => {
		return execSQL(dbConn, "ALTER SYSTEM STOP SQLSCRIPT CODE COVERAGE");
	},

	getCoverageResults: (dbConn) => {
		let coverageSQL = "SELECT * FROM M_SQLSCRIPT_CODE_COVERAGE_RESULTS";
		var codeCoverageSQL =
			` SELECT DISTINCT START_POSITION, END_POSITION, SUM(HIT_COUNT) AS HIT_COUNT FROM M_SQLSCRIPT_CODE_COVERAGE_RESULTS
           GROUP BY START_POSITION, END_POSITION
           ORDER BY START_POSITION DESC, END_POSITION DESC`;
		return execSQL(dbConn, codeCoverageSQL);
	},

	getCoverageObjectDefinitions: (dbConn) => {
		return execSQL(dbConn, "SELECT * FROM M_SQLSCRIPT_CODE_COVERAGE_OBJECT_DEFINITIONS");
	},

	getCoveragePretty: (dbConn, oId) => {
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
	},

	getDebugSessions: (dbConn) => {
		return execSQL(dbConn, "SELECT * FROM M_DEBUG_SESSIONS");
	},

	getDebugConnections: (dbConn) => {
		return execSQL(dbConn, "SELECT * FROM M_DEBUG_CONNECTIONS");
	},

	enableIndex: (dbConn) => {
		return execSQL(dbConn,
			`ALTER SYSTEM ALTER CONFIGURATION ('indexserver.ini','SYSTEM')
                             SET ('DEBUGGING_BACKEND','ENABLE_CODE_COVERAGE')='TRUE' WITH RECONFIGURE;`
		);
	},

	enableSystem: (dbConn) => {
		return execSQL(dbConn,
			`ALTER SYSTEM ALTER CONFIGURATION ('global.ini','SYSTEM')
                             SET ('DEBUGGING_BACKEND','ENABLE_CODE_COVERAGE')='TRUE' WITH RECONFIGURE;`
		);
	},

	escapeHTML: (coverageString) => {
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

		coverageString =
			`<html>
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

};