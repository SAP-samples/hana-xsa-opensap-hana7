/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, dot-notation: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output =
			`<H1>ZIP Examples</H1></br> 
			<a href="${req.baseUrl}/example1">/example1</a> - Download data in ZIP format - folder and files</br>
			<a href="${req.baseUrl}/zipPO">/zipPO</a> - Download Purchase Orders in ZIP format</br>`;
		res.type("text/html").status(200).send(output);
	});

	//Simple Database Select - In-line Callbacks
	app.get("/example1", (req, res) => {
		let zip = new require("node-zip")();
		zip.file("folder1/demo1.txt", "This is the new ZIP Processing in Node.js");
		zip.file("demo2.txt", "This is also the new ZIP Processing in Node.js");
		let data = zip.generate({
			base64: false,
			compression: "DEFLATE"
		});
		res.header("Content-Disposition", "attachment; filename=ZipExample.zip");
		return res.type("application/zip").status(200).send(new Buffer(data, "binary"));
	});

	//Simple Database Select - In-line Callbacks
	app.get("/zipPO", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let client = new dbClass(req.db);
			const statement = await client.preparePromisified(
				`SELECT TOP 25000 "PurchaseOrderId", "PartnerId", "CompanyName", "CreatedByLoginName", "CreatedAt", "GrossAmount" 
				   FROM "PO.HeaderView" ORDER BY "PurchaseOrderId" `
			);
			const results = await client.statementExecPromisified(statement, []);
			let out = "";
			for (let item of results) {
				out += item.PurchaseOrderId + "\t" + item.PartnerId + "\t" + item.CompanyName + "\t" + item.CreatedByLoginName + "\t" + item.CreatedAt +
					"\t" + item.GrossAmount + "\n";
			}
			let zip = new require("node-zip")();
			zip.file("po.txt", out);
			let data = zip.generate({
				base64: false,
				compression: "DEFLATE"
			});
			res.header("Content-Disposition", "attachment; filename=poWorklist.zip");
			return res.type("application/zip").status(200).send(new Buffer(data, "binary"));
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	return app;
};