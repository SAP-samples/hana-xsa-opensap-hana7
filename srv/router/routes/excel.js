/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, dot-notation: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var excel = require("node-xlsx");
var fs = require("fs");
var path = require("path");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output =
			`<H1>Excel Examples</H1></br>
			<a href="${req.baseUrl}/download">/download</a> - Download data in Excel XLSX format</br>`;
		res.type("text/html").status(200).send(output);
	});

	//Simple Database Select - In-line Callbacks
	app.get("/download", async(req, res) => {
		try {
			const dbClass = require(global.__base + "utils/dbPromises");
			let client = new dbClass(req.db);
			const statement = await client.preparePromisified(
				`SELECT TOP 10 "HEADER.PURCHASEORDERID" as "ID",  
							   "PRODUCT.PRODUCTID" as "PRODUCT", 
								GROSSAMOUNT as "AMOUNT" 
								FROM "PO.Item"`
			);
			const results = await client.statementExecPromisified(statement, []);
			let out = [];
			for (let item of results) {
				out.push([item.ID, item.PRODUCT, item.AMOUNT]);
			}
			var result = excel.build([{
				name: "Purchase Orders",
				data: out
			}]);
			res.header("Content-Disposition", "attachment; filename=Excel.xlsx");
			return res.type("application/vnd.ms-excel").status(200).send(result);
		} catch (e) {
			return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`);
		}
	});

	return app;
};