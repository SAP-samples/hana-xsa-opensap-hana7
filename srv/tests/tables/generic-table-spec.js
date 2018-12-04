/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {

	this.base = __dirname + "/";
	this.test = require("../../utils/tests");
	this.results = [{
		"TABLE_NAME": "Conversions.T006"
	}, {
		"TABLE_NAME": "Conversions.T006A"
	}, {
		"TABLE_NAME": "Conversions.TCURC"
	}, {
		"TABLE_NAME": "Conversions.TCURF"
	}, {
		"TABLE_NAME": "Conversions.TCURN"
	}, {
		"TABLE_NAME": "Conversions.TCURR"
	}, {
		"TABLE_NAME": "Conversions.TCURT"
	}, {
		"TABLE_NAME": "Conversions.TCURV"
	}, {
		"TABLE_NAME": "Conversions.TCURW"
	}, {
		"TABLE_NAME": "Conversions.TCURX"
	}, {
		"TABLE_NAME": "MD.Addresses"
	}, {
		"TABLE_NAME": "MD.BusinessPartner"
	}, {
		"TABLE_NAME": "MD.Employees"
	}, {
		"TABLE_NAME": "MD.Products"
	}, {
		"TABLE_NAME": "OPENSAP_PURCHASEORDER_HEADERS"
	}, {
		"TABLE_NAME": "OPENSAP_PURCHASEORDER_ITEMS"
	}, {
		"TABLE_NAME": "PO.Header"
	}, {
		"TABLE_NAME": "PO.Item"
	}, {
		"TABLE_NAME": "PurchaseOrder.Header"
	}, {
		"TABLE_NAME": "PurchaseOrder.Item"
	}, {
		"TABLE_NAME": "SO.Filter"
	}, {
		"TABLE_NAME": "SO.Header"
	}, {
		"TABLE_NAME": "SO.Item"
	}, {
		"TABLE_NAME": "Util.Attachments"
	}, {
		"TABLE_NAME": "Util.Constants"
	}, {
		"TABLE_NAME": "Util.Messages"
	}, {
		"TABLE_NAME": "Util.Notes"
	}, {
		"TABLE_NAME": "Util.SSCOOKIE"
	}, {
		"TABLE_NAME": "Util.Texts"
	},  {
		"TABLE_NAME": "shadow::MDShadow.Addresses"
	}, {
		"TABLE_NAME": "shadow::MDShadow.BusinessPartner"
	}, {
		"TABLE_NAME": "shadow::MDShadow.Employees"
	}, {
		"TABLE_NAME": "shadow::MDShadow.Products"
	}, {
		"TABLE_NAME": "shadow::POShadow.Header"
	}, {
		"TABLE_NAME": "shadow::POShadow.Item"
	}, {
		"TABLE_NAME": "shadow::SOShadow.Filter"
	}, {
		"TABLE_NAME": "shadow::SOShadow.Header"
	}, {
		"TABLE_NAME": "shadow::SOShadow.Item"
	}, {
		"TABLE_NAME": "shadow::UtilShadow.Attachments"
	}, {
		"TABLE_NAME": "shadow::UtilShadow.Constants"
	}, {
		"TABLE_NAME": "shadow::UtilShadow.Notes"
	}, {
		"TABLE_NAME": "shadow::UtilShadow.Texts"
	}];

	this.results.forEach(async(test) => {
		it(`Table Test: ${test.TABLE_NAME}`, async(done) => {
			try {
				let db = await this.test.getDBClass(await this.test.getClient());
				let sql = `SELECT * FROM "${test.TABLE_NAME}"`;
				let statement = await db.preparePromisified(sql);
				let results = await db.statementExecPromisified(statement, []);
				expect(results.length).not.toBeLessThan(1, `Table Name: ${test.TABLE_NAME}`);
				done();
			} catch (err) {
				done.fail(err);
			}
		});
	});

});