/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = () => {
	var app = express.Router();

	//HANA DB Client 
	app.get("/", (req, res) => {
		let client = require("@sap/hana-client");
		//Lookup HANA DB Connection from Bound HDB Container Service
		const xsenv = require("@sap/xsenv");
		let hanaOptions = xsenv.getServices({
			hana: {
				plan: "hdi-shared"
			}
		});
		//Create DB connection with options from the bound service
		let conn = client.createConnection();
		var connParams = {
			serverNode: hanaOptions.hana.host + ":" + hanaOptions.hana.port,
			uid: hanaOptions.hana.user,
			pwd: hanaOptions.hana.password,
			CURRENTSCHEMA: hanaOptions.hana.schema
		};

		//connect
		conn.connect(connParams, (err) => {
			if (err) {
				return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			} else {
				conn.exec(`SELECT SESSION_USER, CURRENT_SCHEMA 
				             FROM "DUMMY"`, (err, result) => {
					if (err) {
						return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					} else {
						conn.disconnect();
						return res.type("application/json").status(200).send(result);
					}
				});
			}
			return null;
		});
	});

	//Simple Database Select Via Client Wrapper/Middelware - In-line Callbacks
	app.get("/express", (req, res) => {
		let client = req.db;
		client.prepare(
			`SELECT SESSION_USER, CURRENT_SCHEMA 
				             FROM "DUMMY"`,
			(err, statement) => {
				if (err) {
					return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				statement.exec([],
					(err, results) => {
						if (err) {
							return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
						} else {
							var result = JSON.stringify({
								Objects: results
							});
							return res.type("application/json").status(200).send(result);
						}
					});
				return null;
			});
	});

	var async = require("async");
	//Simple Database Select Via Client Wrapper/Middelware - Async Waterfall
	app.get("/waterfall", (req, res) => {
		let client = req.db;
		async.waterfall([
			function prepare(callback) {
				client.prepare(`SELECT SESSION_USER, CURRENT_SCHEMA 
				            	  FROM "DUMMY"`,
					(err, statement) => {
						callback(null, err, statement);
					});
			},

			function execute(err, statement, callback) {
				statement.exec([], (execErr, results) => {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				return callback();
			}
		]);
	});

	//Simple Database Select Via Client Wrapper/Middelware - Promises
	app.get("/promises", (req, res) => {
		const dbClass = require(global.__base + "utils/dbPromises");
		let db = new dbClass(req.db);
		db.preparePromisified(`SELECT SESSION_USER, CURRENT_SCHEMA 
				            	 FROM "DUMMY"`)
			.then(statement => {
				db.statementExecPromisified(statement, [])
					.then(results => {
						let result = JSON.stringify({
							Objects: results
						});
						return res.type("application/json").status(200).send(result);
					})
					.catch(err => {
						return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					});
			})
			.catch(err => {
				return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			});
	});

	//Simple Database Select Via Client Wrapper/Middelware - Await
	app.get("/await", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let db = new dbClass(req.db);
			const statement = await db.preparePromisified(`SELECT SESSION_USER, CURRENT_SCHEMA 
				            								 FROM "DUMMY"`);
			const results = await db.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				Objects: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	//Simple Database Call Stored Procedure
	app.get("/procedures", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		//(client, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "get_po_header_data", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp({}, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				var result = JSON.stringify({
					EX_TOP_3_EMP_PO_COMBINED_CNT: results
				});
				res.type("application/json").status(200).send(result);
			});
		});
	});

	//Database Call Stored Procedure With Inputs
	app.get("/procedures2/:partnerRole?", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var partnerRole = req.params.partnerRole;
		var inputParams = "";
		if (typeof partnerRole === "undefined" || partnerRole === null) {
			inputParams = {};
		} else {
			inputParams = {
				IM_PARTNERROLE: partnerRole
			};
		}
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "get_bp_addresses_by_role", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				var result = JSON.stringify({
					EX_BP_ADDRESSES: results
				});
				res.type("application/json").status(200).send(result);
			});
		});
	});

	//Call 2 Database Stored Procedures in Parallel
	app.get("/proceduresParallel/", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		var inputParams = {
			IM_PARTNERROLE: "1"
		};
		var result = {};
		async.parallel([

			function(cb) {
				hdbext.loadProcedure(client, null, "get_po_header_data", (err, sp) => {
					if (err) {
						cb(err);
						return;
					}
					//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
					sp(inputParams, (err, parameters, results) => {
						result.EX_TOP_3_EMP_PO_COMBINED_CNT = results;
						cb();
					});
				});

			},
			function(cb) {
				//(client, Schema, Procedure, callback)            		
				hdbext.loadProcedure(client, null, "get_bp_addresses_by_role", (err, sp) => {
					if (err) {
						cb(err);
						return;
					}
					//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
					sp(inputParams, (err, parameters, results) => {
						result.EX_BP_ADDRESSES = results;
						cb();
					});
				});
			}
		], (err) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			} else {
				res.type("application/json").status(200).send(JSON.stringify(result));
			}
		});
	});

	app.get("/whoAmI", (req, res) => {
		var userContext = req.authInfo;
		var result = JSON.stringify({
			userContext: userContext
		});
		res.type("application/json").status(200).send(result);
	});

	app.get("/env", (req, res) => {
		return res.type("application/json").status(200).send(JSON.stringify(process.env));
	});

	app.get("/org", (req, res) => {
		let VCAP = JSON.parse(process.env.VCAP_APPLICATION);
		return res.type("application/json").status(200).send(JSON.stringify(VCAP.organization_name));
	});

	app.get("/space", (req, res) => {
		let VCAP = JSON.parse(process.env.VCAP_APPLICATION);
		return res.type("application/json").status(200).send(JSON.stringify(VCAP.space_name));
	});

	app.get("/userinfo", function(req, res) {
		let xssec = require("@sap/xssec");
		let xsenv = require("@sap/xsenv");
		let accessToken;
		let authWriteScope = false;
		let authReadScope = false;
		let controllerAdminScope = true;
		let userInfo = {
			"name": req.user.id,
			"familyName": req.user.name.familyName,
			"emails": req.user.emails,
			"scopes": [],
			"identity-zone": req.authInfo.identityZone
		};
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
			userInfo.scopes = securityContext.scopes;
			console.log("Scope checked successfully");
		});
		return res.type("application/json").status(200).json(userInfo);
	});

	app.get("/hdb", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let dbConn = new dbClass(req.db);
			const statement = await dbConn.preparePromisified(
				`SELECT FROM OPENSAP_PURCHASEORDER_ITEMVIEW { 
			                 PURCHASEORDERID as "PurchaseOrderId", 
            				 PRODUCT as "ProductID", 
            				 GROSSAMOUNT as "Amount"  } `
			);
			const results = await dbConn.statementExecPromisified(statement, []);
			let result = JSON.stringify({
				PurchaseOrders: results
			});
			return res.type("application/json").status(200).send(result);
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});

	app.get("/tables", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let dbConn = new dbClass(req.db);
			const statement = await dbConn.preparePromisified(
				`SELECT TABLE_NAME FROM M_TABLES 
				  WHERE SCHEMA_NAME = CURRENT_SCHEMA 
				    AND RECORD_COUNT > 0 `
			);
			const results = await dbConn.statementExecPromisified(statement, []);
			return res.type("application/json").status(200).send(JSON.stringify(results));
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});
	
	app.get("/views", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let dbConn = new dbClass(req.db);
			const statement = await dbConn.preparePromisified(
				`SELECT VIEW_NAME FROM VIEWS 
				  WHERE SCHEMA_NAME = CURRENT_SCHEMA 
				    AND (VIEW_TYPE = 'ROW' or VIEW_TYPE = 'CALC')`
			);
			const results = await dbConn.statementExecPromisified(statement, []);
			return res.type("application/json").status(200).send(JSON.stringify(results));
		} catch (err) {
			return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
		}
	});
	
	app.get("/os", (req, res) => {
		var os = require("os");
		var output = {};

		output.tmpdir = os.tmpdir();
		output.endianness = os.endianness();
		output.hostname = os.hostname();
		output.type = os.type();
		output.platform = os.platform();
		output.arch = os.arch();
		output.release = os.release();
		output.uptime = os.uptime();
		output.loadavg = os.loadavg();
		output.totalmem = os.totalmem();
		output.freemem = os.freemem();
		output.cpus = os.cpus();
		output.networkInfraces = os.networkInterfaces();

		var result = JSON.stringify(output);
		res.type("application/json").status(200).send(result);
	});

	app.get("/osUser", (req, res) => {
		var exec = require("child_process").exec;
		exec("whoami", (err, stdout, stderr) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			} else {
				res.type("text/plain").status(200).send(stdout);
			}
		});
	});
	
	return app;
};