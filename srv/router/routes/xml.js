/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var XmlDocument = require("xmldoc").XmlDocument;

module.exports = function() {
	var app = express.Router();
	//Hello Router
	app.get("/", (req, res) => {
		var output = `<H1>XML Examples</H1></br>
				<a href="${req.baseUrl}/example1">/example1</a> - Simple XML parsing</br>`;
		res.type("text/html").status(200).send(output);
	});

	//Simple Database Select - In-line Callbacks
	app.get("/example1", (req, res) => {
		const xml =
		`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
			<!-- this is a note -->
			<note noteName="NoteName">
				<to>To</to>
				<from>From</from>
				<heading>Note heading</heading>
				<body>Note body</body>
			</note>
		</xml>`;
		let body = "";
		let note = new XmlDocument(xml);
		note.eachChild((item) => {
			body += item.val + '</br>';
		});
		return res.type("text/html").status(200).send(body);
	});
	return app;
};