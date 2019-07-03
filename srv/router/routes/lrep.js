/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

function upsertVariant(req, res) {
	var body = req.body;
	var client = req.db;
	var insertString = "UPSERT \"lrep.variants\" " +
		" (\"fileName\", \"fileType\", \"changeType\", \"reference\", \"packageName\", \"content\", " +
		"  \"namespace\", \"originalLanguage\", \"conditions\", \"context\", " +
		"  \"supportGenerator\", \"supportService\", \"supportUser\",  " +
		"  \"layer\", \"selector\", \"texts\", \"variantName\" ) " +
		" VALUES(?, ?, ?, ?, ?, TO_NCLOB(?), ?, ?, ?, ?, ?, ?, SESSION_CONTEXT('APPLICATIONUSER'), ?, ?, TO_NCLOB(?), ? ) " +
		" WHERE \"changeType\" = ? AND \"fileType\" = ? AND \"layer\" = ? AND \"supportUser\" = SESSION_CONTEXT('APPLICATIONUSER') " +
		" AND \"variantName\" = ? ";
	client.prepare(
		insertString,
		(err, statement) => {
			if (err) {
				res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
				return;
			}
			var generator = "";
			var service = "";
			var variantName = "";

			if (typeof body.support !== "undefined") {
				generator = body.support.generator;
				service = body.support.service;
			}
			if (typeof body.texts !== "undefined") {
				if (typeof body.texts.variantName !== "undefined") {
					variantName = body.texts.variantName.value;
				}
			}

			statement.exec([body.fileName, body.fileType, body.changeType, body.reference, body.packageName,
					JSON.stringify(body.content), body.namespace, body.originalLanguage, JSON.stringify(body.conditions), body.context,
					generator, service, body.layer, JSON.stringify(body.selector), JSON.stringify(body.texts),
					variantName, body.changeType, body.fileType, body.layer, variantName
				],
				(err, results) => {
					if (err) {
						res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
						return;
					} else {
						res.type("application/json").status(200).send(body);
					}
				});
		});

}

module.exports = function() {
	var app = express.Router();
	var bodyParser = require("body-parser");
	app.use(bodyParser.json());

	app.get("/", (req, res) => {
		res.type("text/html").status(200).send("");
	});

	app.get("/actions/getcsrftoken/", (req, res) => {
		res.type("text/html").status(200).send("");
	});

	app.post("/variants/", (req, res) => {
		upsertVariant(req, res);
	});

	app.put("/variants/:fileName", (req, res) => {
		var body = req.body;
		var client = req.db;
		var fileNameInput = req.params.fileName;

		var insertString = "UPSERT \"lrep.variants\" " +
			" (\"fileName\", \"fileType\", \"changeType\", \"reference\", \"packageName\", \"content\", " +
			"  \"namespace\", \"originalLanguage\", \"conditions\", \"context\", " +
			"  \"supportGenerator\", \"supportService\", \"supportUser\",  " +
			"  \"layer\", \"selector\", \"texts\", \"variantName\" ) " +
			" VALUES(?, ?, ?, ?, ?, TO_NCLOB(?), ?, ?, ?, ?, ?, ?, SESSION_CONTEXT('APPLICATIONUSER'), ?, ?, TO_NCLOB(?), ? ) " +
			" WHERE \"fileName\" = ? ";
		client.prepare(
			insertString,
			(err, statement) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					return;
				}
				var generator = "";
				var service = "";
				var variantName = "";

				if (typeof body.support !== "undefined") {
					generator = body.support.generator;
					service = body.support.service;
				}
				if (typeof body.texts !== "undefined") {
					if (typeof body.texts.variantName !== "undefined") {
						variantName = body.texts.variantName.value;
					}
				}

				statement.exec([body.fileName, body.fileType, body.changeType, body.reference, body.packageName,
						JSON.stringify(body.content), body.namespace, body.originalLanguage, JSON.stringify(body.conditions), body.context,
						generator, service, body.layer, JSON.stringify(body.selector), JSON.stringify(body.texts),
						variantName, fileNameInput
					],
					(err, results) => {
						if (err) {
							res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
							return;
						} else {
							res.type("application/json").status(200).send(body);
						}
					});
			});

	});

	app.delete("/variants/:fileName", (req, res) => {
		var body = req.body;
		var client = req.db;
		var fileNameInput = req.params.fileName;

		var deleteString = "DELETE FROM \"lrep.variants\" " +
			" WHERE \"fileName\" = ? ";
		client.prepare(
			deleteString,
			(err, statement) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					return;
				}
				statement.exec([ fileNameInput
					],
					(err, results) => {
						if (err) {
							res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
							return;
						} else {
							res.type("application/json").status(200).send(body);
						}
					});
			});

	});

	app.post("/changes/", (req, res) => {
		upsertVariant(req, res);
	});

	app.get("/flex/data/:app?", (req, res) => {
		var outer = {
			"changes": [],
			"settings": {
				"isKeyUser": true,
				"isAtoAvailable": false,
				"isProductiveSystem": false
			}
		};
		var appInput = req.params.app;
		var client = req.db;
		var insertString = "SELECT * from \"lrep.userVariants\" " +
			" WHERE \"reference\" = ? ";
		client.prepare(
			insertString,
			(err, statement) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					return;
				}
				statement.exec([appInput],
					(err, results) => {
						if (err) {
							res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
							return;
						} else {
							var body = {};
							for (var i = 0; i < results.length; i++) {
								body = {};
								body.fileName = results[i].fileName;
								body.fileType = results[i].fileType;
								body.changeType = results[i].changeType;
								body.conditions = JSON.parse(results[i].conditions);
								body.content = JSON.parse(results[i].content);
								body.context = results[i].context;
								body.creation = results[i].creation;
								body.layer = results[i].layer;
								body.namespace = results[i].namespace;
								body.originalLanguage = results[i].originalLanguage;
								body.packageName = results[i].packageName;
								body.reference = results[i].reference;
								body.selector = JSON.parse(results[i].selector);
								body.texts = JSON.parse(results[i].texts);
								body.support = {};
								body.support.generator = results[i].supportGenerator;
								body.support.service = results[i].service;
								body.support.user = results[i].user;
								outer.changes.push(body);
							}
							res.type("application/json").status(200).send(outer);
						}
					});
			});

	});

	return app;
};