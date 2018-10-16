/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, dot-notation: 0, new-cap: 0*/
/*eslint-env node, es6 */
"use strict";
var express = require("express");
var excel = require("node-xlsx");

module.exports = function() {
	var app = express.Router();

	//Hello Router
	app.get("/", (req, res) => {
		var output = `<H1>Excel Examples</H1></br>
			<a href="${req.baseUrl}/download">/download</a> - Download data in Excel XLSX format</br>` +
			require(global.__base + "utils/exampleTOC").fill();
		res.type("text/html").status(200).send(output);
	});

	//Simple Database Select - In-line Callbacks
	app.get("/download", (req, res) => {
		var client = req.db;
		var query = "SELECT TOP 10 " +
			" \"HEADER.PURCHASEORDERID\" as \"ID\", " +
			" \"PRODUCT.PRODUCTID\" as \"PRODUCT\", " +
			" GROSSAMOUNT as \"AMOUNT\" " +
			" FROM \"PO.Item\"  ";
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
							var out = [];
							for(let item of rs){ 
								out.push([item.ID, item.PRODUCT, item.AMOUNT]);
							}
							var result = excel.build([{
								name: "Purchase Orders",
								data: out
							}]);
							res.header("Content-Disposition", "attachment; filename=Excel.xlsx");
							res.type("application/vnd.ms-excel").status(200).send(result);
						}
					});
			});
	});

	//Simple Database Select - In-line Callbacks
	app.get("/downloadPO", (req, res) => {
		var client = req.db;
		var query = "SELECT TOP 25000 \"PurchaseOrderId\", \"PartnerId\", \"CompanyName\", \"CreatedByLoginName\", \"CreatedAt\", \"GrossAmount\" " + "FROM \"PO.HeaderView\" order by \"PurchaseOrderId\" ";
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
							var out = [];
							for(let item of rs){ 
								out.push([item["PurchaseOrderId"], item["PartnerId"], item["CompanyName"], item["CreatedByLoginName"],  item["CreatedAt"], item["GrossAmount"]]);
							}
							var result = excel.build([{
								name: "Purchase Orders",
								data: out
							}]);
							res.header("Content-Disposition", "attachment; filename=poWorklist.xlsx");
							res.type("application/vnd.ms-excel").status(200).send(result);
						}
					});
			});
	});

	return app;
};
