/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, dot-notation: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output = `<H1>ZIP Examples</H1></br> 
			<a href="${req.baseUrl}/example1">/example1</a> - Download data in ZIP format - folder and files</br>` +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	//Simple Database Select - In-line Callbacks
	app.get("/example1", (req, res) => {

		var zip = new require("node-zip")();
		zip.file("folder1/demo1.txt", "This is the new ZIP Processing in Node.js");
		zip.file("demo2.txt", "This is also the new ZIP Processing in Node.js");
		var data = zip.generate({
			base64: false,
			compression: "DEFLATE"
		});

		res.header("Content-Disposition", "attachment; filename=ZipExample.zip");
		res.type("application/zip").status(200).send(new Buffer(data, "binary"));

	});

	//Simple Database Select - In-line Callbacks
	app.get("/zipPO", (req, res) => {
		var client = req.db;
		var query =
			"SELECT TOP 25000 \"PurchaseOrderId\", \"PartnerId\", \"CompanyName\", \"CreatedByLoginName\", \"CreatedAt\", \"GrossAmount\" " +
			"FROM \"PO.HeaderView\" order by \"PurchaseOrderId\" ";
		client.prepare(
			query,
			(err, statement) => {
				if (err) {
					res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
					return;
				}
				statement.exec([],
					(err, rs) => {
						if (err) {
							res.type("text/plain").status(500).send(`ERROR: ${err.toString()}`);
						} else {
							var out = "";
							for (let item of rs){
								out += item.PurchaseOrderId + "\t" + item.PartnerId + "\t" + item.CompanyName + "\t" + item.CreatedByLoginName + "\t" + item.CreatedAt + "\t" + item.GrossAmount + "\n";
							}

							var zip = new require("node-zip")();
							zip.file("po.txt", out);
							var data = zip.generate({
								base64: false,
								compression: "DEFLATE"
							});

							res.header("Content-Disposition", "attachment; filename=poWorklist.zip");
							res.type("application/zip").status(200).send(new Buffer(data, "binary"));
						}
					});
			});
	});

	return app;
};
