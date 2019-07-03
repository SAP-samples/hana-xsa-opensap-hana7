/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		this.db = await this.test.getDBClass(await this.test.getClient());
		this.sp = await this.test.getStoredProc(this.db, "dynamic_sql_scalar_var");
		this.sp2 = await this.test.getStoredProc(this.db, "dynamic_sql_table_var");		
		done();
	});

	it("Dynamic Scalar", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp, {});
			expect(results.outputScalar.EX_VALUE).not.toBeLessThan(31250);
			expect(results.outputScalar.EX_VALUE).not.toBeGreaterThan(31250);			
			done();

		} catch (err) {
			done.fail(err);
		}
	});
	
	it("Dynamic Table", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp2, {IM_TABLE_NAME: "\"MD.Products\"", IM_MULTIPLIER: 0.05});
			expect(results.results.length).not.toBeLessThan(106);
			expect(results.results[0].PRODUCTID).toBe("HT-1000");
			done();

		} catch (err) {
			done.fail(err);
		}
	});
	
});