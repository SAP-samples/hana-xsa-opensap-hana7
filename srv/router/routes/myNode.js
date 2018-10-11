/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	app.get("/", (req, res) => {
		return res.type("text/plain").status(200).send("Hello World Node.js");
	});

	app.get("/example1", (req, res) => {
		var scope = `${req.authInfo.xsappname}.Display`;
		if (req.authInfo && !req.authInfo.checkScope(scope)) {
			return res.type("text/plain").status(403).send("Forbidden");
		}

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
		return null;
	});

	//Simple Database Call Stored Procedure
	app.get("/products", (req, res) => {
		var client = req.db;
		var hdbext = require("@sap/hdbext");
		//(client, Schema, Procedure, callback)
		hdbext.loadProcedure(client, null, "build_products", (err, sp) => {
			if (err) {
				return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp({}, (err, parameters, results) => {
				if (err) {
					return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				let out = [];
				for (let item of results) {
					out.push([item.PRODUCTID, item.CATEGORY, item.PRICE]);
				}
				var excel = require("node-xlsx");
				var excelOut = excel.build([{
					name: "Products",
					data: out
				}]);
				res.header("Content-Disposition", "attachment; filename=Excel.xlsx");
				return res.type("application/vnd.ms-excel").status(200).send(excelOut);
			});
			return null;
		});
	});

	app.get("/sflightExt", (req, res) => {
		var scope = `${req.authInfo.xsappname}.Display`;
		if (req.authInfo && !req.authInfo.checkScope(scope)) {
			return res.type("text/plain").status(403).send("Forbidden");
		}

		let client = req.db;
		client.prepare(
			`SELECT TOP 100 *   
			        FROM "SflightExt"`,
			(err, statement) => {
				if (err) {
					return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				}
				statement.exec([],
					(err, results) => {
						if (err) {
							return res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
						} else {
							return res.type("application/json").status(200).send(JSON.stringify(results));
						}
					});
				return null;
			});
		return null;
	});

	//Security Context via Passport
	app.get("/passport", (req, res) => {
		res.type("application/json").status(200).send(JSON.stringify(req.authInfo));
	});

	app.get("/env", (req, res) => {
		return res.type("application/json").status(200).send(JSON.stringify(process.env));
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
		accessToken = require(global.__base + "utils/auth").getAccessToken(req);
		userInfo.accessToken = accessToken;
		var b64string = accessToken;
		var buf = Buffer.from(b64string, "base64");
		userInfo.accessTokenDecoded = buf.toString();

		return res.type("application/json").status(200).json(JSON.stringify(userInfo));

	});

	app.get("/info", function(req, res) {
		let xssec = require("@sap/xssec");
		let xsenv = require("@sap/xsenv");
		var info = {};
		info.port = process.env.PORT;
		info.host = process.env.HOST;

		function isCloudFoundryPlatform() {
			try {
				var oAppInfo = JSON.parse(process.env.VCAP_APPLICATION);
				return (!!oAppInfo.cf_api);
			} catch (e) {
				// Not valid JSON -- assume XSA
				return false;
			}
		}
		info.isCloudFoundry = isCloudFoundryPlatform();
		info.applicationName = process.env.VCAP_APPLICATION.application_name;
	//	info.MTAVersion = process.env.MTA_METADATA.version;
		info.uris = process.env.VCAP_APPLICATION.uris;
		info.applicationUris = process.env.VCAP_APPLICATION.application_uris;
		info.spaceId = process.env.VCAP_APPLICATION.space_id;
		info.spaceName = process.env.VCAP_APPLICATION.space_name;
		info.instanceId = process.env.VCAP_APPLICATION.instance_id;
		info.debug = process.env.NODE_ENV !== "production";
		info.apiEndPoint = process.env.API_END_POINT;
		info.caPath = process.env.XS_CACERT_PATH;
		info.secudir = process.env.SECUDIR;
		return res.type("application/json").status(200).json(JSON.stringify(info));
	});

	return app;
};