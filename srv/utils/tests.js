/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0, quotes:0 */
/*eslint-env node, es6 */

"use strict";
module.exports = {

	getClient: () => {
		return new Promise((resolve, reject) => {
			let hdb = require("@sap/hdbext");
			let xsenv = require("@sap/xsenv");
			let hanaOptions = xsenv.getServices({
				hana: {
					tag: "hana"
				}
			});
			//	let pool = hdb.getPool(hanaOptions.hana);
			hdb.createConnection(hanaOptions.hana, (error, client) => {
				if (error) {
					reject(console.error(error));
				}
				if (client) {
					resolve(client);
				}
			});
			/*		pool.acquire(null, (error, client) => {
						if (error) {
							reject(console.error(error));
						}
						if (client) {
							console.log("Client Created");
							resolve(client);
						}
					});*/
		});
	},

	getDBClass: (dbConn) => {
		return new Promise((resolve, reject) => {
			let base = __dirname + "/";
			const dbClass = require(base + "/dbPromises");
			let db = new dbClass(dbConn);
			resolve(db);
		});

	},

	getStoredProc: (db, procName) => {
		return new Promise((resolve, reject) => {
			let hdbext = require("@sap/hdbext");
			db.loadProcedurePromisified(hdbext, null, procName)
				.then(sp => {
					resolve(sp);
				})
				.catch(err => {
					reject(err);
				});
		});

	},

	execSQL: (dbConn, sql) => {
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

};