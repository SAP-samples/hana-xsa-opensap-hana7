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
			let sql = "SELECT * FROM \"POTextSearch\"(?,?)";
			let statement = await this.db.preparePromisified(sql);
			let results = await this.db.statementExecPromisified(statement, ["*AP", "OTHERS"]);
			expect(results.length).not.toBeLessThan(1);
			expect(results[0].RESULTS).toBe("SAP");
			expect(results[0].ATTRIBUTE).toBe("COMPANYNAME");			
			done();
		} catch (err) {
			done.fail(err);
		}
	});

});