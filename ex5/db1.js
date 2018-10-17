/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");

module.exports = () => {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		let client = require("@sap/hana-client");
		//Lookup HANA DB Connection from Bound HDB Container Service
		const xsenv = require("@sap/xsenv");
		let hanaOptions = xsenv.getServices({
			hana: {
				tag: "hana"
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
				return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
			} else {
				conn.exec(`SELECT SESSION_USER, CURRENT_SCHEMA 
				             FROM "DUMMY"`, (err, result) => {
					if (err) {
						return res.type("text/plain").status(500).send(`ERROR: ${JSON.stringify(err)}`);
					} else {
						conn.disconnect();
						return res.type("application/json").status(200).send(result);
					}
				});
			}
			return null;
		});
	});
	return app;
};
