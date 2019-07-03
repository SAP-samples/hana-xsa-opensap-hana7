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
			let sql = "SELECT \"apply_discount\"(?,?).EX_RESULT AS EX_RESULT FROM DUMMY";
			let statement = await this.db.preparePromisified(sql);
			let results = await this.db.statementExecPromisified(statement, [200, 0.10]);
			expect(results.length).not.toBeLessThan(1);
			expect(results[0].EX_RESULT).not.toBeLessThan(180);
			expect(results[0].EX_RESULT).not.toBeGreaterThan(180);			
			done();
		} catch (err) {
			done.fail(err);
		}
	});

});