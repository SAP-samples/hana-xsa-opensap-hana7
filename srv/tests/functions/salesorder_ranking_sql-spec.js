/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		try {
			this.db = await this.test.getDBClass(await this.test.getClient());
			done();
		} catch (err) {
			done.fail(err);
		}
	});
	it("Value Test", async(done) => {
		try {
			let sql = "SELECT * FROM \"SALESORDER_RANKING_AND_DISCOUNT_SQL\"(TO_DATE(?, 'YYYYMMDD'),TO_DATE(?, 'YYYYMMDD'),?)";
			let statement = await this.db.preparePromisified(sql);
			let results = await this.db.statementExecPromisified(statement, ["20100101", "20161231","AMER"]);
			expect(results.length).not.toBeLessThan(16);
			expect(results[0].ORDERS).not.toBeLessThan(40);
			done();
		} catch (err) {
			done.fail(err);
		}
	});

});