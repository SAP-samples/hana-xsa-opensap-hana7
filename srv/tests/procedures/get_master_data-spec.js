/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0, dot-notation:0, no-use-before-define:0 */
/*eslint-env node, es6 */
"use strict";
// use test spec file name as description to allow navigation from the test results view
describe(__filename, () => {
	this.base = __dirname + "/";
	this.test = require("../../utils/tests");

	beforeEach(async(done) => {
		this.db = await this.test.getDBClass(await this.test.getClient());
		this.sp = await this.test.getStoredProc(this.db, "get_master_data");
		done();
	});

	it("Value Test", async(done) => {
		try {
			let results = await this.db.callProcedurePromisified(this.sp, {});
			expect(results.results0.length).toBe(results.outputScalar.EX_EMP_COUNT);
			expect(results.results1.length).toBe(results.outputScalar.EX_PROD_COUNT);
			expect(results.results2.length).toBe(results.outputScalar.EX_BP_COUNT);	
			expect(results.outputScalar.EX_EMP_EXISTS).toBe(false);		
			done();

		} catch (err) {
			done.fail(err);
		}
	});
});