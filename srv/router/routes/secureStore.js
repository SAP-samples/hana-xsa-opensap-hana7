/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = () => {
	var app = express.Router();
	
	var bodyParser = require("body-parser");
	app.use(bodyParser.raw({type: "text/plain"}));  //Process request Body and return a Buffer
	
	//Secure Store Insert
	app.post("/:key?", (req, res) => {
		var hdbext = require("@sap/hdbext");
		var key = req.params.key;
		var inputParams = "";
		if (typeof key === "undefined" || key === null) {
			res.type("text/plain").status(500).send("ERROR: No Secure Store Key Input Parameter Specified");
			return;
		} else {
			inputParams = {
				KEY: key
			};
		}
		inputParams.STORE_NAME = "OPENSAP_HANA7_TEST_STORE";
		inputParams.FOR_XS_APPLICATIONUSER = true;
		inputParams.VALUE = req.body;
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(req.db, "SYS", "USER_SECURESTORE_INSERT", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.message.toString()}`);
					return;
				}
				res.type("application/json").status(200).send(`Entry in secure store sucesssfully created for key: ${key} and value: ${req.body.toString("utf8")} `);
			});
		});
	});
	
	//Secure Store Retrieve
	app.get("/:key?", (req, res) => {
		var hdbext = require("@sap/hdbext");
		var key = req.params.key;
		var inputParams = "";
		if (typeof key === "undefined" || key === null) {
			res.type("text/plain").status(500).send("ERROR: No Secure Store Key Input Parameter Specified");
			return;
		} else {
			inputParams = {
				KEY: key
			};
		}
		inputParams.STORE_NAME = "OPENSAP_HANA7_TEST_STORE";
		inputParams.FOR_XS_APPLICATIONUSER = true;
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(req.db, "SYS", "USER_SECURESTORE_RETRIEVE", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.message.toString()}`);
					return;
				}
				res.type("application/json").status(200).send(`Entry in secure store sucesssfully retrieved for key: ${key} and value: ${results.VALUE.toString("utf8")} `);
			});
		});
	});

	//Secure Store Delete
	app.delete("/:key?", (req, res) => {
		var hdbext = require("@sap/hdbext");
		var key = req.params.key;
		var inputParams = "";
		if (typeof key === "undefined" || key === null) {
			res.type("text/plain").status(500).send("ERROR: No Secure Store Key Input Parameter Specified");
			return;
		} else {
			inputParams = {
				KEY: key
			};
		}
		inputParams.STORE_NAME = "OPENSAP_HANA7_TEST_STORE";
		inputParams.FOR_XS_APPLICATIONUSER = true;
		//(cleint, Schema, Procedure, callback)
		hdbext.loadProcedure(req.db, "SYS", "USER_SECURESTORE_DELETE", (err, sp) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			//(Input Parameters, callback(errors, Output Scalar Parameters, [Output Table Parameters])
			sp(inputParams, (err, parameters, results) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.message.toString()}`);
					return;
				}
				res.type("application/json").status(200).send(`Entry in secure store sucesssfully deleted for key: ${key} `);
			});
		});
	});
	
	return app;
};